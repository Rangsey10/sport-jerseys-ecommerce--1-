import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Football",
    image: "/footballblackfeature.png",
    href: "/products?category=football",
    description: "NFL & College Football Jerseys",
  },
  {
    name: "Basketball",
    image: "/LAL+MNK+DF+SWGMN+JSY+ASC+22.avif",
    href: "/products?category=basketball",
    description: "NBA & International Basketball Jerseys",
  },
  {
    name: "Soccer",
    image: "/messifeature.png",
    href: "/products?category=soccer",
    description: "International & Club Soccer Jerseys",
  },
  {
    name: "Baseball",
    image: "/Baseballfeature.png",
    href: "/products?category=baseball",
    description: "MLB & Baseball League Jerseys",
  },
];

export default function CategoriesPage() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find jerseys from your favorite sports and teams
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} className="group">
              <div className="rounded-lg overflow-hidden shadow hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 bg-gray-50">
                <div className="relative h-64">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
