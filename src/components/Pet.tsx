import { Heart, Zap, PawPrint } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PetProps {
    pet: {
        name: string;
        level: number;
        happiness: number;
        health: number;
    };
}

export const Pet: React.FC<PetProps> = ({ pet }) => {
    const navigate = useNavigate();

    const getPetEmoji = () => {
        if (pet.happiness >= 70) return <img src={"../assets/images/Image1.png"} alt="Feliz" className="w-20 h-20" />;
        if (pet.happiness >= 30) return <img src={"../assets/images/Image2.png"} alt="Triste" className="w-20 h-20" />;
        return <img src={"../ assets / images / Image2.png"} alt="Muriendo" className="w - 20 h - 20" />;
    };

    return (
        <>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Tu mascota: {pet.name}</h3>

            <div className="flex justify-between w-full items-center gap-6 mb-4">
                <div className="animate-bounce-slow duration-750">{getPetEmoji()}</div>

                <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-center text-sm text-gray-700">
                        <div className="flex items-center">
                            <Heart className="w-4 h-4 text-pink-500 mr-2" />
                            Felicidad
                        </div>
                        <span className="font-semibold">{Math.round(pet.happiness)}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-700">
                        <div className="flex items-center">
                            <Zap className="w-4 h-4 text-green-500 mr-2" />
                            Salud
                        </div>
                        <span className="font-semibold">{Math.round(pet.health)}%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-700">
                        <div className="flex items-center">
                            <PawPrint className="w-4 h-4 text-indigo-500 mr-2" />
                            Nivel
                        </div>
                        <span className="font-semibold">Nivel {Math.floor(pet.level)}</span>
                    </div>
                </div>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
                <div
                    className="h-full bg-gradient-to-r from-pink-400 to-green-400 transition-all duration-500"
                    style={{ width: `${pet.happiness}%` }}
                ></div>
            </div>
        </>
    );
};

