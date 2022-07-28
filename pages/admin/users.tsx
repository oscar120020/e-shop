import { PeopleOutline } from "@mui/icons-material";
import { AdminLayout } from "../../components/layouts";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Grid, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import useSWR from "swr";
import { Loading } from "../../components/ui";
import { IUser, ValidRoles } from "../../interfaces";
import { ChangeEvent, useEffect, useState } from "react";
import { tesloApi } from "../../api";
import axios, { AxiosError } from "axios";

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>("/api/admin/users");
  const [users, setUsers] = useState<IUser[]>([])
  
  useEffect(() => {
    if(data){
        setUsers(data)
    }
  }, [data])

  if (!data && !error) {
    return <Loading title="Cargando usuarios" />;
  }

  const onRoleUpdated = async (userId: string, newRole: string) => {
    const prevUsers = [...users]
    const updatedUsers = users.map(user => ({
        ...user,
        role: user._id === userId ? newRole as ValidRoles : user.role
    }))

    setUsers(updatedUsers)

    try {
      await tesloApi.put("/admin/users", { userId, role: newRole });
    } catch (error) {
      setUsers(prevUsers)
      if (axios.isAxiosError(error) && error instanceof AxiosError) {
        console.log(error.response?.data.message);
      } else {
        console.log(error);
      }
      alert("No se pudo actualizar el usuario");
    }
  };

  const columns: GridColDef[] = [
    { field: "email", headerName: "Correo", width: 250 },
    { field: "name", headerName: "Nombre completo", width: 250 },
    {
      field: "role",
      headerName: "Rol",
      width: 250,
      renderCell: (params) => (
        <Select 
            sx={{ width: "100%" }} 
            label="Rol" 
            value={params.row.role}
            onChange={(e) => onRoleUpdated(params.row.id, e.target.value)}
        >
          <MenuItem value="client">Cliente</MenuItem>
          <MenuItem value="admin">Administrador</MenuItem>
        </Select>
      ),
    },
  ];

  const rows = users!.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));

  return (
    <AdminLayout
      title="Usuarios"
      subTitle="Mantenimiento de usuarios"
      icon={<PeopleOutline />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
