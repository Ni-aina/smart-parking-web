import { getParkingById } from "@/actions/parkingLots.action";
import { getAgents } from "@/actions/profile.action";
import { getTypes } from "@/actions/type.action";
import FormParkingLots from "@/components/Parking-lots/Form";
import HeaderBack from "@/components/ui/headerBack";

interface FormPageInterface {
    params: Promise<{ id: string }>
}

const FormPage = async ({ params }: FormPageInterface) => {
    const { id } = await params;

    const [types, agents, parking] = await Promise.all([
        getTypes(),
        getAgents(),
        getParkingById(id)
    ])

    return (
        <div className="flex flex-col gap-5 text-white/90 lg:p-2">
            <HeaderBack
                title="Parking lot"
                action={parking?.id ? "Edit" : "New"}
            />
            <div className="mt-3">
                <FormParkingLots
                    types={types}
                    agents={agents}
                    parking={parking}
                />
            </div>
        </div>
    )
}
 
export default FormPage;