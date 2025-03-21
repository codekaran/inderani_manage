const QuickAccess = (props) => {
  const quickList = [
    {
      name: "Samosa",
      image: "/samosa.jpeg",
      quantity: "1",
      rate_flag: false,
      rate: 15,
      cost: 15,
    },
    {
      name: "Rasmalai Pc",
      quantity: "1",
      rate_flag: false,
      image: "/rasmalai.jpeg",
      rate: 50,
      cost: 50,
    },
    {
      name: "Matar",
      image: "/matar.jpeg",
      quantity: ".25",
      rate_flag: false,
      rate: 280,
      cost: 70,
    },
    {
      name: "Milk",
      quantity: "1",
      rate_flag: false,
      image: "/milk.jpeg",
      rate: 34,
      cost: 34,
    },
    {
      name: "Curd",
      quantity: ".100",
      rate_flag: false,
      image: "/curd.jpg",
      rate: 100,
      cost: 10,
    },
    {
      name: "Lassi",
      quantity: "1",
      rate_flag: false,
      image: "/lassi.jpeg",
      rate: 60,
      cost: 60,
    },
    {
      name: "Bread",
      quantity: "1",
      rate_flag: false,
      image: "/bread.jpg",
      rate: 20,
      cost: 20,
    },
    {
      name: "Gulab Jamun Pc",
      rate_flag: true,
      image: "/gulab_jamun.jpeg",
      piece: {
        name: "Gulab Jamun Pc",
        quantity: "1",
        rate: 20,
        cost: 20,
      },
      rt: {
        name: "Gulab Jamun",
        quantity: ".25",
        rate: 480,
        cost: 120,
      },
    },
    {
      name: "Malai Puri Pc",
      quantity: "1",
      rate_flag: true,
      image: "/malai_puri.jpeg",
      piece: {
        name: "Malai Puri Pc",
        quantity: "1",
        rate: 40,
        cost: 40,
      },
      rt: {
        name: "Malai Puri",
        quantity: ".25",
        rate: 560,
        cost: 140,
      },
    },
    {
      name: "Gujiya Pc",
      quantity: "1",
      rate_flag: true,
      image: "/gujiya.jpeg",
      piece: {
        name: "Gujiya Pc",
        quantity: "1",
        rate: 35,
        cost: 35,
      },
      rt: {
        name: "Gujiya",
        quantity: ".25",
        rate: 520,
        cost: 130,
      },
    },
    {
      name: "Rasbhari",
      quantity: ".25",
      rate_flag: false,
      image: "/Rasbari.jpeg",
      rate: 560,
      cost: 140,
    },
    {
      name: "Mix Mithai",
      quantity: ".25",
      rate_flag: false,
      image: "/mix.jpeg",
      rate: 560,
      cost: 140,
    },
    {
      name: "Boondi Ladoo",
      quantity: ".25",
      rate_flag: true,
      piece: {
        name: "Boondi Ladoo Pc",
        quantity: "1",
        rate: 12,
        cost: 12,
      },
      rt: {
        name: "Boondi Ladoo",
        quantity: ".25",
        rate: 280,
        cost: 70,
      },
      image: "/motichoor.webp",
    },
    {
      name: "White Barfi",
      quantity: ".25",
      rate_flag: false,
      image: "/white.jpeg",
      rate: 560,
      cost: 140,
    },
    {
      name: "Rasgulla Pc",
      quantity: "1",
      rate_flag: false,
      image: "/rasgulla.jpeg",
      rate: 35,
      cost: 35,
    },
    {
      name: "Dhokla",
      quantity: "1",
      rate_flag: true,
      image: "/dhokla.jpeg",
      piece: {
        name: "Dhokla Plate",
        quantity: "1",
        rate: 30,
        cost: 30,
      },
      rt: {
        name: "Dhokla",
        quantity: ".25",
        rate: 280,
        cost: 70,
      },
    },
    {
      name: "Milk Cake",
      quantity: ".25",
      rate_flag: false,
      image: "/milk_cake.jpeg",
      rate: 600,
      cost: 150,
    },
    {
      name: "Paneer",
      quantity: ".25",
      rate_flag: false,
      image: "/paneer.jpeg",
      rate: 440,
      cost: 110,
    },
    {
      name: "Til Sweet Mathi",
      quantity: ".25",
      rate_flag: false,
      image: "/til.jpeg",
      rate: 280,
      cost: 70,
    },
    {
      name: "Methi Mathi",
      quantity: ".25",
      rate_flag: false,
      image: "/methi.jpeg",
      rate: 280,
      cost: 70,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 h-fit mt-4 ">
      {quickList.map((item, index) => (
        <div
          key={index}
          className={`bg-cover bg-center w-32 h-28 cursor-pointer border relative`}
          style={{ backgroundImage: `url(${item.image})` }}
          onClick={(e) =>
            props.handleAdd(item.name, item.quantity, item.rate, item.cost, e)
          }
        >
          <div className=" w-full h-full flex justify-evenly relative group overflow-hidden">
            {item.rate_flag ? (
              <>
                <button
                  onClick={(e) =>
                    props.handleAdd(
                      item.piece.name,
                      item.piece.quantity,
                      item.piece.rate,
                      item.piece.cost,
                      e
                    )
                  }
                  className=" w-1/2 h-full bg-opacity-50 bg-red-400  right-32 absolute transform transition-transform duration-300 group-hover:translate-x-32 z-10"
                >
                  {item.name == "Dhokla" ? "Plate" : "Piece"}
                </button>
                <button
                  onClick={(e) =>
                    props.handleAdd(
                      item.rt.name,
                      item.rt.quantity,
                      item.rt.rate,
                      item.rt.cost,
                      e
                    )
                  }
                  className=" w-1/2 h-full bg-opacity-50 bg-blue-400  left-32 absolute transform transition-transform duration-300 group-hover:-translate-x-32 z-10"
                >
                  Rate
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickAccess;
