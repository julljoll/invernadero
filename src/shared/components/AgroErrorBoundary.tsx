import { Component, ErrorInfo, ReactNode } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';

interface Props {
  children: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AgroErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[AgroErrorBoundary] Error en módulo "${this.props.moduleName || 'Desconocido'}":`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="card-agro border-danger my-4 shadow-sm">
          <Card.Body className="p-4 text-center">
            <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle bg-danger bg-opacity-10 text-danger mb-3">
              <span className="material-symbols-outlined" style={{ fontSize: '2.5rem' }}>
                emergency_home
              </span>
            </div>
            <h4 className="fw-bold text-danger mb-2">
              Incidencia en Módulo: {this.props.moduleName || 'Agronómico'}
            </h4>
            <p className="text-secondary text-sm mb-3">
              Ocurrió un error inesperado al renderizar los cálculos de este componente. La telemetría y los demás módulos de la finca continúan operando con normalidad.
            </p>
            {this.state.error && (
              <Alert variant="danger" className="text-start font-mono text-xs py-2 px-3 mb-4 overflow-auto">
                {this.state.error.message || String(this.state.error)}
              </Alert>
            )}
            <div className="d-flex justify-content-center gap-3">
              <Button
                variant="outline-secondary"
                size="sm"
                className="touch-target-48 px-4 fw-semibold"
                onClick={() => window.location.reload()}
              >
                Recargar Cockpit
              </Button>
              <Button
                variant="success"
                size="sm"
                className="touch-target-48 px-4 fw-bold"
                onClick={this.handleReset}
              >
                Reintentar Módulo
              </Button>
            </div>
          </Card.Body>
        </Card>
      );
    }

    return this.props.children;
  }
}
