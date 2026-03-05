
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import UserList from '@/components/users/UserList';

export default function UsuariosPage() {

  return (
    <DashboardLayout>
      <div className="space-y-6">
          <UserList />
      </div>
    </DashboardLayout>
  );
} 