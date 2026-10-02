import { getParkingById } from "@/actions/lot.action";
import { getAgents } from "@/actions/profile.action";
import FormParkingLots from "@/components/Parking-lots/LotForm";
import HeaderBack from "@/components/ui/headerBack";

interface FormPageInterface {
    params: Promise<{ id: string }>
}

const FormPage = async ({ params }: FormPageInterface) => {
    const { id } = await params;

    const [agents, parking] = await Promise.all([
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
                    agents={agents}
                    parking={parking}
                />
            </div>
        </div>
    )
}
 
export default FormPage;