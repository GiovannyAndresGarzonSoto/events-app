import { model, Schema, type ObjectId } from "mongoose"

interface IEvent extends Document {
    name: string
    description: string
    startDate: Date
    endDate: Date
    maxParticipants: number
    status: "active" | "completed" | "pending" | "cancelled"
    prize: string
    category: string
    imageUrl?: string
    rules?: string
    participationCost?: number
    participants: ObjectId[]
    winnerId?: ObjectId
    creatorId: ObjectId
    visibility: "public" | "private"
    invitationCode?: string
    participationLimit: number
    drawDate?: Date
    createdAt: Date
    updatedAt: Date
}

const eventSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    maxParticipants: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        required: true, 
        enum: ["active", "completed", "pending", "cancelled"], 
        default: "pending" 
    },
    prize: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    imageUrl: { 
        type: String 
    },
    rules: { 
        type: String 
    },
    participationCost: { 
        type: Number, 
        default: 0 
    },
    participants: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    winnerId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    creatorId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    visibility: { 
        type: String, 
        required: true, 
        enum: ["public", "private"], 
        default: "public" 
    },
    invitationCode: { 
        type: String 
    },
    participationLimit: { 
        type: Number, 
        default: 1 
    },
    drawDate: { 
        type: Date 
    }
}, { timestamps: true ,
    versionKey: false
})

export default model<IEvent>('Event', eventSchema)