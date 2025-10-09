import { getParkingById } from "@/actions/parkingLots.action";
import { getProfiles } from "@/actions/profile.action";
import { getTypes } from "@/actions/type.action";
import FormParkingLots from "@/components/Parking-lots/Form";
import HeaderBack from "@/components/ui/headerBack";

interface FormPageInterface {
    params: Promise<{ id: string }>
}

const FormPage = async ({ params }: FormPageInterface) => {
    const { id } = await params;

    const [types, profiles, parking] = await Promise.all([
        getTypes(),
        getProfiles(),
        getParkingById(id)
    ])

    return (
        <div className="flex flex-col gap-5 text-white/80 lg:p-2">
            <HeaderBack
                title="Parking lot"
                action={parking?.id ? "Edit" : "New"}
            />
            <div className="mt-3">
                <FormParkingLots
                    types={types}
                    profiles={profiles}
                    parking={parking}
                />
            </div>
        </div>
    )
}
 
export default FormPage;