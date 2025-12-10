import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AppCards = ({ Links = [] }: { Links?: AppLink[] }) => {
  const { authUser } = useAuth();

  return (
    Links && (
      <div className="my-4 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4 2xl:grid-cols-6 ">
        {Links.map(
          (link, index) =>
            (authUser?.roleId ?? 0) > link?.minRole && (
              <Link key={index} to={link.href}>
                <div className="min-h-96 overflow-hidden rounded-md border-2 border-solid border-zinc-100 shadow-lg transition-transform duration-200 hover:scale-[1.03] hover:shadow-xl">
                  <img className="w-full" src={link.image} alt={link.label} />
                  <div className="px-2 py-4 md:px-6">
                    <h4>{link.label}</h4>
                    <div className="my-2 h-0.5 bg-zinc-400"></div>
                    <p>{link.desc}</p>
                  </div>
                </div>
              </Link>
            )
        )}
      </div>
    )
  );
};

export default AppCards;
