import { GlobalConfig } from "payload/types";
import { isAdmin } from "../access/isAdmin";

const zelle: GlobalConfig = {
    slug: 'zelle',
    access: {
        read: () => true,
        update: isAdmin,
    },
    admin: {
        group: 'Informacion de Pago',
    },
    fields: [
        {
            name: 'email',
            type: 'text',
            label: 'Email',
            required: true,
        },
        {
            name: 'zelleHolder',
            type: 'text',
            label: 'Nombre del titular',
            required: true,
        },
        {
            name: 'bank',
            type: 'text',
            label: 'Banco',
            required: true,
        },
    ],
};

export default zelle;