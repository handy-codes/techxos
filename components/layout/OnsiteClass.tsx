import Image from "next/image";
import React from "react";

const OnsiteClass = () => {
  return (
    <div className="flex flex-wrap justify-between gap-6 mb-4 p-6">
      <div className="h-[80vh] w-[90vw] md:w-[50vw]">
          <h1 className="text-3xl md:text-4xl font-bold">
            Onsite Classes
          </h1>
          <p className="">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus delectus dolorem labore omnis? Mollitia reprehenderit neque debitis a voluptatibus quis voluptatem ab nesciunt facere sunt accusamus magni dolores dignissimos amet quaerat, exercitationem corporis ex dolorem incidunt doloremque velit eum. Reprehenderit, numquam a doloribus placeat ducimus sapiente laboriosam ipsam adipisci aliquam ipsa ipsum dolorem cupiditate ut culpa corporis commodi pariatur quae, maxime esse. Doloremque error voluptates corporis iusto? Et cupiditate consequatur itaque dolore, totam atque ipsa iure fugiat dolor, doloremque quis temporibus minima magni. Asperiores veniam at blanditiis adipisci quia voluptates quaerat aspernatur modi, et voluptatibus laboriosam quam pariatur, unde odit.
          </p>
      </div>
      <div className="h-[80vh] w-[90vw] md:w-[50vw]">
        <Image
          src="/gomycode1.png"
          alt="Onsite Class"
            width={500}
            height={500}
        />
      </div>
    </div>
  );
};

export default OnsiteClass;
