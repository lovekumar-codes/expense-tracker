import Category from "../models/category.model";

const defaultCategories = [
{
name: "Food",
color: "#ef4444",
isDefault: true,
},
{
name: "Shopping",
color: "#3b82f6",
isDefault: true,
},
{
name: "Bills",
color: "#f59e0b",
isDefault: true,
},
{
name: "Transport",
color: "#10b981",
isDefault: true,
},
];

const seedCategories = async () => {

for (const category of defaultCategories) {

const exists =
  await Category.findOne({
    name: category.name,
    isDefault: true,
  });

if (!exists) {
  await Category.create(category);
}

}

console.log(
"✅ Default categories seeded"
);
};

export default seedCategories;