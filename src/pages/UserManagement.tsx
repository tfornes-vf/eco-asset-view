import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Check, X, UserCog, Trash2 } from "lucide-react";
import { Profile } from "@/types/auth";

export default function UserManagement() {
  const { profile } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers((data || []) as Profile[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: t('error.title') || 'Error',
        description: t('userManagement.fetchError') || 'Error al cargar usuarios'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, isApproved: boolean, role?: string) => {
    try {
      const updates: any = {
        is_approved: isApproved,
        approved_by: profile?.id,
        approved_at: new Date().toISOString()
      };

      if (role) updates.role = role;

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
      toast({
        title: t('success.title') || 'Éxito',
        description: isApproved 
          ? t('userManagement.userApproved') || 'Usuario aprobado correctamente'
          : t('userManagement.userRejected') || 'Usuario rechazado'
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        variant: "destructive",
        title: t('error.title') || 'Error',
        description: t('userManagement.updateError') || 'Error al actualizar usuario'
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (profile?.email !== 'tfornes@vfiels.com') {
      toast({
        variant: "destructive",
        title: t('error.title') || 'Error',
        description: t('userManagement.deletePermissionError') || 'Solo el superusuario puede eliminar usuarios'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      await fetchUsers();
      toast({
        title: t('success.title') || 'Éxito',
        description: t('userManagement.userDeleted') || 'Usuario eliminado correctamente'
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: t('error.title') || 'Error',
        description: t('userManagement.deleteError') || 'Error al eliminar usuario'
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'superuser': return 'destructive';
      case 'admin': return 'default';
      case 'viewer': return 'secondary';
      default: return 'outline';
    }
  };

  const canManageUser = (user: Profile) => {
    if (profile?.role === 'superuser') return true;
    if (profile?.role === 'admin' && user.role !== 'superuser') return true;
    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('loading') || 'Cargando...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center space-x-2 mb-6">
        <Users className="w-6 h-6" />
        <h1 className="text-2xl font-bold">
          {t('userManagement.title') || 'Gestión de Usuarios'}
        </h1>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{user.display_name || user.email}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getRoleBadgeVariant(user.role || 'viewer')}>
                    {t(`roles.${user.role}`) || user.role || 'viewer'}
                  </Badge>
                  <Badge variant={user.is_approved ? 'default' : 'outline'}>
                    {user.is_approved 
                      ? t('userManagement.approved') || 'Aprobado'
                      : t('userManagement.pending') || 'Pendiente'
                    }
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {t('userManagement.joinedOn') || 'Se unió el'}: {new Date(user.created_at).toLocaleDateString()}
                </div>
                
                {canManageUser(user) && (
                  <div className="flex items-center space-x-2">
                    {!user.is_approved && (
                      <>
                        <Select
                          onValueChange={(role) => updateUserStatus(user.id, true, role)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder={t('userManagement.selectRole') || 'Seleccionar rol'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">
                              {t('roles.viewer') || 'Visualizador'}
                            </SelectItem>
                            {profile?.role === 'superuser' && (
                              <SelectItem value="admin">
                                {t('roles.admin') || 'Administrador'}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateUserStatus(user.id, false)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    
                    {user.is_approved && (
                      <>
                        <Select
                          value={user.role || 'viewer'}
                          onValueChange={(role) => updateUserStatus(user.id, true, role)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">
                              {t('roles.viewer') || 'Visualizador'}
                            </SelectItem>
                            {profile?.role === 'superuser' && (
                              <SelectItem value="admin">
                                {t('roles.admin') || 'Administrador'}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        
                        {profile?.email === 'tfornes@vfiels.com' && user.email !== 'tfornes@vfiels.com' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}