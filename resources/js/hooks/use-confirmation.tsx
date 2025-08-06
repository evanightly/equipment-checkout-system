import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

interface ConfirmationOptions {
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive' | 'success' | 'warning';
    icon?: React.ReactNode;
}

interface ConfirmationResult {
    confirmed: boolean;
}

export const useConfirmation = () => {
    const confirm = (options: ConfirmationOptions): Promise<ConfirmationResult> => {
        return new Promise((resolve) => {
            const { title, description, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'default', icon } = options;

            // Get appropriate icon based on variant
            const getIcon = () => {
                if (icon) return icon;
                switch (variant) {
                    case 'destructive':
                        return <AlertTriangle className='h-4 w-4 text-red-500' />;
                    case 'success':
                        return <CheckCircle className='h-4 w-4 text-green-500' />;
                    case 'warning':
                        return <AlertTriangle className='h-4 w-4 text-yellow-500' />;
                    default:
                        return <Info className='h-4 w-4 text-blue-500' />;
                }
            };

            // Get appropriate button variant
            const getButtonVariant = () => {
                switch (variant) {
                    case 'destructive':
                        return 'destructive';
                    case 'success':
                        return 'default';
                    default:
                        return 'default';
                }
            };

            toast.custom(
                (t) => (
                    <div className='flex flex-col space-y-3 rounded-lg border bg-background p-4 shadow-md'>
                        <div className='flex items-center space-x-2'>
                            {getIcon()}
                            <h4 className='font-semibold'>{title}</h4>
                        </div>
                        {description && <p className='text-sm text-muted-foreground'>{description}</p>}
                        <div className='flex justify-end space-x-2'>
                            <Button
                                onClick={() => {
                                    toast.dismiss(t);
                                    resolve({ confirmed: false });
                                }}
                                size='sm'
                                variant='outline'
                            >
                                {cancelText}
                            </Button>
                            <Button
                                onClick={() => {
                                    toast.dismiss(t);
                                    resolve({ confirmed: true });
                                }}
                                size='sm'
                                variant={getButtonVariant()}
                            >
                                {confirmText}
                            </Button>
                        </div>
                    </div>
                ),
                {
                    duration: Infinity,
                    className: 'w-full max-w-md',
                },
            );
        });
    };

    // Predefined confirmation types for common use cases
    const confirmDelete = (itemName?: string): Promise<ConfirmationResult> => {
        return confirm({
            title: 'Delete Confirmation',
            description: itemName
                ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
                : 'Are you sure you want to delete this item? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            variant: 'destructive',
        });
    };

    const confirmApprove = (itemName?: string): Promise<ConfirmationResult> => {
        return confirm({
            title: 'Approve Request',
            description: itemName ? `Are you sure you want to approve "${itemName}"?` : 'Are you sure you want to approve this request?',
            confirmText: 'Approve',
            cancelText: 'Cancel',
            variant: 'success',
        });
    };

    const confirmReject = (itemName?: string): Promise<ConfirmationResult> => {
        return confirm({
            title: 'Reject Request',
            description: itemName ? `Are you sure you want to reject "${itemName}"?` : 'Are you sure you want to reject this request?',
            confirmText: 'Reject',
            cancelText: 'Cancel',
            variant: 'destructive',
        });
    };

    const confirmReturn = (itemName?: string): Promise<ConfirmationResult> => {
        return confirm({
            title: 'Return Equipment',
            description: itemName
                ? `Are you sure you want to mark "${itemName}" as returned?`
                : 'Are you sure you want to mark this equipment as returned?',
            confirmText: 'Return',
            cancelText: 'Cancel',
            variant: 'success',
        });
    };

    return {
        confirm,
        confirmDelete,
        confirmApprove,
        confirmReject,
        confirmReturn,
    };
};
