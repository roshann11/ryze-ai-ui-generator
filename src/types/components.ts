
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'search';
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  fullWidth?: boolean;
}

export interface TableColumn {
  key: string;
  header: string;
  width?: string;
}

export interface TableProps {
  columns: TableColumn[];
  data: Record<string, any>[];
  striped?: boolean;
  hoverable?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface SidebarProps {
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
  position?: 'left' | 'right';
  isOpen?: boolean;
}

export interface NavbarProps {
  brand?: string;
  children?: React.ReactNode;
  variant?: 'light' | 'dark';
}

export interface ChartProps {
  type: 'bar' | 'line' | 'pie';
  data: ChartDataPoint[];
  title?: string;
  height?: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}