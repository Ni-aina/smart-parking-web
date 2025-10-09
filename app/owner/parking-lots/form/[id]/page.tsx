import FormParkingLots from "@/components/Parking-lots/Form";
import HeaderBack from "@/components/ui/headerBack";
import { isUUID } from "@/utils/isUUID";

interface FormPageInterface {
    params: Promise<{ id: string }>
}

const FormPage = async ({ params }: FormPageInterface) => {
    const { id } = await params;
    const isIdVerified = isUUID(id);

    return (
        <div className="flex flex-col gap-5 text-white/80 lg:p-2">
            <HeaderBack
                title="Parking lot"
                action={isIdVerified ? "Edit" : "New"}
            />
            <div className="mt-3">
                <FormParkingLots
                    id={isIdVerified ? id : null}
                />
            </div>
        </div>
    )
}
 
export default FormPage;