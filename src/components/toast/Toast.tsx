import { Bounce, toast } from 'react-toastify';


export function useToaster() {
    
    const showErrorToast = (message: string) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            transition: Bounce,
        })
        // toast({
        //     title: 'Error',
        //     description: message,
        //     status: 'error',
        //     duration: 2000,
        //     isClosable: true,
        // });
        return showErrorToast;
    };

    const showSuccessToast = (message : string) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            transition: Bounce,
        });
        return showSuccessToast;
    };

    const showLoadingToast = (promise: Promise<any>, messages: { pending: string; success: string; error: string }) => {
        return toast.promise(
          promise,
          {
            pending: messages.pending,
            success: messages.success,
            error: messages.error,
          },
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
            transition: Bounce,
          }
        );
      };
    
    return { showErrorToast, showSuccessToast, showLoadingToast };
}