interface FormPageInterface {
    params: Promise<{ id: string }>
}

const FormPage = async ({ params }: FormPageInterface) => {
    const { id } = await params;

    return (
        <>
        
        </>
    )
}
 
export default FormPage;