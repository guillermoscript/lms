import { GlobalConfig } from "payload/types";
import { isAdmin } from "../access/isAdmin";
import VenezuelanBanks from "../fields/VenezuelanBanks";

const pagoMovil: GlobalConfig = {
    slug: 'pago-movil',
    access: {
        read: () => true,
        update: isAdmin,
    },
    admin: {
        group: 'Informacion de Pago',
    },
    fields: [
        {
            name: 'phone',
            type: 'text',
            label: 'Teléfono',
            required: true,
        },
        {
            name: 'name',
            type: 'text',
            label: 'Nombre',
            required: true,
        },
        {
            name: 'cid',
            type: 'text',
            label: 'Cédula',
            required: true,
        },
        VenezuelanBanks(),
    ],
};

export default pagoMovil