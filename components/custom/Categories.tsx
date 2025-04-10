"use client&quot;

import { Category } from &quot;@prisma/client&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { useRouter } from &quot;next/navigation&quot;;

interface CategoriesProps {
  categories: Category[];
  selectedCategory: string | null;
}

const Categories = ({ categories, selectedCategory }: CategoriesProps) => {
  const router = useRouter();

  const onClick = (categoryId: string | null) => {
    router.push(categoryId ? `/categories/${categoryId}` : &quot;/");
  };

  return (
    <div className="flex flex-wrap px-4 gap-7 justify-center my-10 text-black font-bold&quot;>
      <Button
        variant={selectedCategory === null ? &quot;default&quot; : &quot;outline&quot;}
        onClick={() => onClick(null)}
      >
        All Categories
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? &quot;default&quot; : &quot;outline"}
          onClick={() => onClick(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default Categories;
