import React from "react";
import { Food } from "@/app/formFood/page"; // pastikan path tipe Food sesuai

interface Props {
  food: Food;
  index: number;
}

const FoodTableRow: React.FC<Props> = ({ food, index }) => (
  <tr key={`food-row-${food.name}-${index}`}>
    <td className="border p-2">{food.name}</td>
    <td className="border p-2">{food.calories} kcal</td>
    <td className="border p-2">{food.protein}g</td>
    <td className="border p-2">{food.carbs}g</td>
    <td className="border p-2">{food.fat}g</td>
    <td className="border p-2">{food.sodium}mg</td>
    <td className="border p-2">{food.porpotionSize}g</td>
  </tr>
);

export default FoodTableRow;
