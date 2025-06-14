import { Heart, Zap } from "lucide-react"

interface PetProps {
    pet: {
        name: string;
        level: number;
        happiness: number;
        health: number;
    };
    getPetEmoji: () => React.ReactNode;
}

export const Pet: React.FC<PetProps> = ({ pet, getPetEmoji }) => {
    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Tu mascota: {pet.name}</h3>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-600">
                    Nivel {Math.floor(pet.level)}
                </span>
            </div>

            <div className="flex items-center mb-4">
                <div className="text-4xl mr-4 animate-bounce-slow">{getPetEmoji()}</div>
                <div className="flex-1 space-y-2">
                    <div className="flex items-center">
                        <Heart className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-sm text-gray-700">Felicidad: {Math.round(pet.happiness)}%</span>
                    </div>
                    <div className="flex items-center">
                        <Zap className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm text-gray-700">Salud: {Math.round(pet.health)}%</span>
                    </div>
                </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${pet.happiness}%` }}
                ></div>
            </div>
        </>
    )
}