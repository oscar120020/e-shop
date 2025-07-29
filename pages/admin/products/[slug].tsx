import React, { ChangeEvent, FC, KeyboardEvent, useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";
import { AdminLayout } from "../../../components/layouts";
import { IProduct } from "../../../interfaces";
import {
  DriveFileRenameOutline,
  SaveOutlined,
  UploadOutlined,
} from "@mui/icons-material";

import {
  Box,
  Button,
  capitalize,
  Card,
  CardActions,
  CardMedia,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  ListItem,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { getProductBySlug } from "../../../database";
import { useForm } from "react-hook-form";
import { tesloApi } from "../../../baseApi";
import { ProductModel } from "../../../models";
import { useRouter } from "next/router";

const validTypes = ["shirts", "pants", "hoodies", "hats"];
const validGender = ["men", "women", "kid", "unisex"];
const validSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

interface FormData {
  _id?: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: string[];
  slug: string;
  tags: string[];
  title: string;
  type: string;
  gender: string;
}

interface Props {
  product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
  const router = useRouter();

  const inputFileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: {errors}, getValues, setValue, watch } = useForm<FormData>({
    defaultValues: product
  });
  const [tagValue, setTagValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const suscription = watch((value, {name, type}) => {
      if(name === 'title'){
        const newSlog = value.title?.trim()
        .replaceAll(' ', '_')
        .replaceAll("'", "")
        .toLocaleLowerCase() || ''
        setValue('slug', newSlog)
      }
    })

    return () => suscription.unsubscribe()
  }, [watch, setValue])

  const onDeleteTag = (tag: string) => {
    const currentTags = getValues('tags')
    setValue('tags', currentTags.filter(t => t !== tag), {shouldValidate: true})
  };

  const onNewTag = () => {
    const newTag = tagValue.trim().toLocaleLowerCase();
    setTagValue('');
    const currentTags = getValues('tags');

    if(newTag.length > 0 && !currentTags.includes(newTag)){
      setValue('tags', [...currentTags, newTag], {shouldValidate: true})
    }
  };

  const onChangeSize = (size: string) => {
    const currentSizes = getValues('sizes');
    if(currentSizes.includes(size)){
      setValue('sizes', currentSizes.filter(s => s !== size), {shouldValidate: true})
    }else{
      setValue('sizes', [...currentSizes, size], {shouldValidate: true})
    }
  }

  const onFileSelected = async({target}: ChangeEvent<HTMLInputElement>) => {
    if(!target.files || target.files.length === 0){
      return;
    }
    
    try {
      for(let file of target.files){
        const formData = new FormData()
        formData.append('file', file)
        const { data } = await tesloApi.post('/admin/upload', formData)
        console.log(data.message);
        setValue('images', [...getValues('images'), data.message], {shouldValidate: true})
      }
    } catch (error) {
      console.log(error);
      
    }
  }

  const onDeleteImage = (image: string) => {
    const currentImages = getValues('images');
    setValue('images', currentImages.filter(i => i !== image), {shouldValidate: true})
  }


  const onSubmit = async(formData: FormData) => {
    console.log(formData);
    if(formData.images.length < 2) return alert('Mínimo 2 imágenes');
    setIsSaving(true)

    try {
      const { data } = await tesloApi({
        url: '/admin/products',
        method: product._id ? 'PUT' : 'POST',
        data: formData
      })

      console.log({data});
      if(!formData._id){
        router.replace(`/admin/products/${data.slug}`)
      }else{
        setIsSaving(false)
      }


    } catch (error) {
      console.log(error);
      setIsSaving(false)
    }

  }

  return (
    <AdminLayout
      title={"Producto"}
      subTitle={product._id ? `Editando: ${product.title}` : 'Crear nuevo producto'}
      icon={<DriveFileRenameOutline />}
    >
      <form onSubmit={handleSubmit(onSubmit)} >
        <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
          <Button
            color="secondary"
            startIcon={<SaveOutlined />}
            sx={{ width: "150px" }}
            type="submit"
            disabled={isSaving}
          >
            Guardar
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Data */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Título"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              { ...register('title', {
                  required: 'Campo requerido',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' }
              })}
              error={ !!errors.title }
              helperText={ errors.title?.message }
            />

            <TextField
              label="Descripción"
              variant="filled"
              fullWidth
              multiline={true}
              sx={{ mb: 1 }}
              { ...register('description', {
                required: 'Campo requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
              })}
              error={ !!errors.description }
              helperText={ errors.description?.message }
            />

            <TextField
              label="Inventario"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              { ...register('inStock', {
                required: 'Campo requerido',
                min: { value: 0, message: 'El valor minimo es 0' }
              })}
              error={ !!errors.inStock }
              helperText={ errors.inStock?.message }
            />

            <TextField
              label="Precio"
              type="number"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              { ...register('price', {
                required: 'Campo requerido',
                min: { value: 1, message: 'El valor minimo es 1' }
              })}
              error={ !!errors.price }
              helperText={ errors.price?.message }
            />

            <Divider sx={{ my: 1 }} />

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Tipo</FormLabel>
              <RadioGroup
                row
                value={ getValues('type') }
                onChange={ ({target}) => setValue('type', target.value, {shouldValidate: true}) }
              >
                {validTypes.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color="secondary" />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormControl sx={{ mb: 1 }}>
              <FormLabel>Género</FormLabel>
              <RadioGroup
                row
                value={ getValues('gender') }
                onChange={ ({target}) => setValue('gender', target.value, {shouldValidate: true}) }
              >
                {validGender.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio color="secondary" />}
                    label={capitalize(option)}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormGroup>
              <FormLabel>Tallas</FormLabel>
              {validSizes.map((size) => (
                <FormControlLabel
                  key={size}
                  label={size}
                  control={<Checkbox checked={ getValues('sizes').includes(size) } />}
                  onChange={() => onChangeSize(size)}
                />
              ))}
            </FormGroup>
          </Grid>

          {/* Tags e imagenes */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Slug - URL"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              { ...register('slug', {
                required: 'Campo requerido',
                validate: (val) => val.trim().includes(" ") ? "No se permiten espacios en blanco" : undefined 
              })}
              error={ !!errors.slug }
              helperText={ errors.slug?.message }
            />

            <TextField
              label="Etiquetas"
              variant="filled"
              fullWidth
              sx={{ mb: 1 }}
              helperText="Presiona [spacebar] para agregar"
              value={tagValue}
              onChange={({target}) => setTagValue(target.value)}
              onKeyUp={( event ) => event.code === "Space" ? onNewTag() : undefined}
            />

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0,
                m: 0,
              }}
              component="ul"
            >
              {getValues('tags').map((tag) => {
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => onDeleteTag(tag)}
                    color="info"
                    size="small"
                    sx={{ ml: 1, mt: 1 }}
                  />
                );
              })}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display="flex" flexDirection="column">
              <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
              <Button
                color="secondary"
                fullWidth
                startIcon={<UploadOutlined />}
                sx={{ mb: 3 }}
                onClick={() => inputFileRef.current?.click()}
              >
                Cargar imagen
              </Button>
              <input 
                ref={inputFileRef}
                type='file' 
                multiple 
                accept="image/jpeg, image/gif, image/png"
                style={{display: 'none'}}
                onChange={onFileSelected}
              />

              <Chip
                label="Es necesario al 2 imagenes"
                color="error"
                variant="outlined"
                sx={{display: getValues('images').length < 2 ? 'flex' : 'none', mb: 2}}
              />

              <Grid container spacing={2}>
                {getValues('images').map((img) => (
                  <Grid item xs={4} sm={3} key={img}>
                    <Card>
                      <CardMedia
                        component="img"
                        className="fadeIn"
                        image={img}
                        alt={img}
                      />
                      <CardActions>
                        <Button fullWidth color="error" onClick={() => onDeleteImage(img)}>
                          Borrar
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { slug = "" } = query;

  let product: IProduct | null;

  if(slug === "new"){
    const tempProduct = JSON.parse(JSON.stringify(new ProductModel()));
    delete tempProduct._id;
    product = tempProduct
  }else{
    product = await getProductBySlug(slug.toString());
  }

  if (!product) {
    return {
      redirect: {
        destination: "/admin/products",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
  };
};

export default ProductAdminPage;
