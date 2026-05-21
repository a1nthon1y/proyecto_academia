'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { Button, Modal, Form, Input, Select, Switch, Checkbox, Tag } from 'antd';
import { EditOutlined, PlusOutlined, LockOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/tables/DataTable';
import { createUser, updateUser, toggleUserStatus } from '@/services/userService';
import { toast } from 'sonner';

const { Option } = Select;

// Genera un preview del username con el mismo patrón que el backend
// a/w/p/t + inicial(nombre) + primer apellido (sin tildes ni espacios)
const limpiar = (txt) =>
  (txt || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');

const previewUsername = ({ nombres, apellidos, rol_id }) => {
  if (!nombres || !apellidos || !rol_id) return '';
  const prefijo = { 1: 'a', 2: 'w', 3: 'p', 4: 't' }[rol_id];
  if (!prefijo) return '';
  const inicial = limpiar(nombres)[0] || '';
  const primerApellido = limpiar(apellidos.split(' ')[0]);
  return `${prefijo}${inicial}${primerApellido}`;
};

const UserForm = ({ form, initialValues, onFinish }) => {
  const [showPasswordField, setShowPasswordField] = useState(false);
  // Re-render para mostrar el preview del username
  const watchedNombres = Form.useWatch('nombres', form);
  const watchedApellidos = Form.useWatch('apellidos', form);
  const watchedRol = Form.useWatch('rol_id', form);
  const watchedUsername = Form.useWatch('username', form);

  const isEditing = !!initialValues;
  const usernamePreview = previewUsername({
    nombres: watchedNombres,
    apellidos: watchedApellidos,
    rol_id: watchedRol,
  });

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Form.Item
          name="nombres"
          label="Nombres"
          rules={[{ required: !isEditing, message: 'Ingrese los nombres' }]}
        >
          <Input placeholder="Juan Carlos" />
        </Form.Item>
        <Form.Item
          name="apellidos"
          label="Apellidos"
          rules={[{ required: !isEditing, message: 'Ingrese los apellidos' }]}
        >
          <Input placeholder="Pérez Gómez" />
        </Form.Item>
      </div>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Ingrese el email' },
          { type: 'email', message: 'Email inválido' }
        ]}
      >
        <Input placeholder="usuario@ejemplo.com" />
      </Form.Item>

      <Form.Item
        name="rol_id"
        label="Rol del Sistema"
        rules={[{ required: true, message: 'Seleccione un rol' }]}
      >
        <Select placeholder="Seleccionar rol" disabled={isEditing}>
          <Option value={1}>ADMINISTRADOR</Option>
          <Option value={2}>TRABAJADOR</Option>
        </Select>
      </Form.Item>

      {!isEditing && (
        <Form.Item
          name="username"
          label={
            <span>
              Nombre de Usuario{' '}
              <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>(opcional)</span>
            </span>
          }
          extra={
            usernamePreview && !watchedUsername
              ? <span style={{ color: '#64748b' }}>Se generará automáticamente como: <b style={{ color: '#1e3a8a' }}>{usernamePreview}</b></span>
              : !watchedUsername
                ? <span style={{ color: '#64748b' }}>Si lo dejas vacío se generará automáticamente</span>
                : null
          }
        >
          <Input placeholder={usernamePreview || 'auto'} />
        </Form.Item>
      )}

      {isEditing && (
        <Form.Item
          name="username"
          label="Nombre de Usuario"
        >
          <Input />
        </Form.Item>
      )}

      {!isEditing ? (
        <Form.Item
          name="password"
          label="Contraseña"
          rules={[
            { required: true, message: 'Ingrese la contraseña' },
            { min: 6, message: 'Mínimo 6 caracteres' },
          ]}
        >
          <Input.Password />
        </Form.Item>
      ) : (
        <>
          <Form.Item>
            <Checkbox
              onChange={(e) => setShowPasswordField(e.target.checked)}
              style={{ marginBottom: '8px' }}
            >
              Cambiar contraseña
            </Checkbox>
          </Form.Item>

          {showPasswordField && (
            <Form.Item
              name="password"
              label="Nueva Contraseña"
              rules={[
                { required: true, message: 'Ingrese la nueva contraseña' },
                { min: 6, message: 'Mínimo 6 caracteres' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Nueva contraseña"
              />
            </Form.Item>
          )}
        </>
      )}
    </Form>
  );
};

export default function UserList() {
  const [form] = Form.useForm();
  const { data: allUsers, isLoading, refetch } = useUsers();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');
  const [rol, setRol] = useState(undefined);

  // Filtros locales (solo frontend)
  const filteredData = (allUsers || []).filter((user) => {
    if (rol && user.rol_id !== rol) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      user.username?.toLowerCase().includes(s) ||
      user.email?.toLowerCase().includes(s) ||
      user.nombres?.toLowerCase().includes(s) ||
      user.apellidos?.toLowerCase().includes(s)
    );
  });

  //console.log('UserList - Data:', data);

  const handleCreate = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      rol_id: user.rol_id,
      nombres: user.nombres || '',
      apellidos: user.apellidos || '',
    });
    setModalVisible(true);
  };

  const handleModalOk = async (values) => {
    try {
      // Si no se marcó cambiar contraseña, eliminamos el campo password
      if (editingUser && !values.password) {
        delete values.password;
      }

      if (editingUser) {
        await updateUser(editingUser.id, values);
        toast.success('Usuario actualizado exitosamente');
      } else {
        await createUser(values);
        toast.success('Usuario creado exitosamente');
      }
      setModalVisible(false);
      setEditingUser(null);
      form.resetFields();
      refetch();
    } catch (error) {
      toast.error(error.message || 'Error al procesar la solicitud');
    }
  };

  const handleToggleStatus = async (id, checked) => {
    try {
      await toggleUserStatus(id, checked);
      toast.success(`Usuario ${checked ? 'activado' : 'desactivado'} exitosamente`);
      refetch();
    } catch (error) {
      toast.error(error.message || 'Error al cambiar el estado');
    }
  };

  const columns = [
    {
      key: 'nombre_completo',
      header: 'Nombre',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800">
            {row.nombres || row.apellidos
              ? `${row.nombres || ''} ${row.apellidos || ''}`.trim()
              : <span className="text-slate-400 italic">(sin nombre)</span>}
          </span>
          <span className="text-xs text-slate-500">@{row.username}</span>
        </div>
      )
    },
    {
      key: 'email',
      header: 'Email'
    },
    {
      key: 'rol',
      header: 'Rol',
      render: (row) => (
        <Tag color={row.rol === 'ADMIN' ? 'gold' : row.rol === 'TRABAJADOR' ? 'blue' : row.rol === 'PADRE' ? 'green' : 'purple'}>
          {row.rol}
        </Tag>
      )
    },
    {
      key: 'activo',
      header: 'Estado',
      render: (row) => (
        <Switch
          checked={row.activo}
          onChange={(checked) => handleToggleStatus(row.id, checked)}
        />
      )
    },
    {
      key: 'creado_en',
      header: 'Fecha de Creación',
      render: (row) => new Date(row.creado_en).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  ];

  const renderActions = (row) => (
    <Button
      type="primary"
      icon={<EditOutlined />}
      onClick={() => handleEdit(row)}
    >
      Editar
    </Button>
  );

  const filterLabels = {
    rol: 'Rol',
    search: 'Búsqueda',
  };
  const activeChips = [];
  const ROL_NOMBRES = { 1: 'Admin', 2: 'Trabajador', 3: 'Padre', 4: 'Tutor' };
  if (rol) activeChips.push({ key: 'rol', label: filterLabels.rol, value: ROL_NOMBRES[rol] || String(rol) });
  if (search) activeChips.push({ key: 'search', label: filterLabels.search, value: search });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gestión de Usuarios</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Nuevo Usuario
        </Button>
      </div>
      <div className="flex gap-2 mb-2 items-center">
        <Select
          allowClear
          placeholder="Rol"
          style={{ width: 140 }}
          onChange={v => setRol(v)}
          value={rol}
        >
          <Option value={1}>ADMIN</Option>
          <Option value={2}>TRABAJADOR</Option>
          <Option value={3}>PADRE</Option>
          <Option value={4}>TUTOR</Option>
        </Select>
        <Input.Search
          placeholder="Buscar por nombre, usuario o email"
          style={{ width: 280 }}
          allowClear
          value={search}
          onChange={e => setSearch(e.target.value)}
          onSearch={v => setSearch(v || '')}
        />
        <Button
          onClick={() => {
            setRol(undefined);
            setSearch('');
          }}
          disabled={activeChips.length === 0}
        >
          Limpiar filtros
        </Button>
        {activeChips.map(chip => (
          <Tag
            key={chip.key}
            closable
            onClose={() => {
              if (chip.key === 'rol') setRol(undefined);
              if (chip.key === 'search') setSearch('');
            }}
            color="blue"
            style={{ marginLeft: 4 }}
          >
            {chip.label}: {chip.value}
          </Tag>
        ))}
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        actions={renderActions}
        pageSize={10}
      />

      <Modal
        title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        open={modalVisible}
        onOk={form.submit}
        onCancel={() => {
          setModalVisible(false);
          setEditingUser(null);
          form.resetFields();
          // Limpiar explícitamente todos los campos al cancelar
          form.setFieldsValue({
            nombre: undefined,
            correo: undefined,
            rol: undefined,
            password: undefined,
          });
        }}
      >
        <UserForm
          form={form}
          initialValues={editingUser}
          onFinish={handleModalOk}
          onCancel={() => {
            setModalVisible(false);
            setEditingUser(null);
            form.resetFields();
            // Limpiar explícitamente todos los campos al cancelar
            form.setFieldsValue({
              nombre: undefined,
              correo: undefined,
              rol: undefined,
              password: undefined,
            });
          }}
        />
      </Modal>
    </div>
  );
} 