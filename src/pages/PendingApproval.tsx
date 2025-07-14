import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, UserCheck } from "lucide-react";

export default function PendingApproval() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {t('pending.title') || 'Pendiente de Aprobación'}
          </CardTitle>
          <CardDescription>
            {t('pending.description') || 'Tu solicitud de acceso está siendo revisada'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <UserCheck className="w-4 h-4" />
            <span className="text-sm">
              {t('pending.message') || 'Un administrador revisará tu solicitud pronto'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('pending.contact') || 'Si tienes alguna pregunta, contacta con el administrador'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}