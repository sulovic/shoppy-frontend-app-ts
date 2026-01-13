import { Route, Routes } from "react-router-dom";
import ProtectRoute from "./ProtectRoute";
import Home from "../pages/Home";
import Nabavke from "../pages/Nabavke/Nabavke";
import Reklamacije from "../pages/Reklamacije/Reklamacije";
import NovaReklamacija from "../pages/Reklamacije/NovaReklamacija";
import PrijemReklamacija from "../pages/Reklamacije/PrijemReklamacija";
import ObradaReklamacija from "../pages/Reklamacije/ObradaReklamacija";
import DelovodnikReklamacija from "../pages/Reklamacije/DelovodnikReklamacija";
import Page404 from "../pages/Page404";
import Users from "../pages/User/Users";
import Dashboard from "../pages/User/Dashboard";
import PregledReklamacije from "../pages/Reklamacije/PregledReklamacije";
import Administrtator from "../pages/Reklamacije/Administrator";
import NewUser from "../pages/User/NewUser";
import Otpad from "../pages/Otpad/Otpad";
import VrsteOtpada from "../pages/Otpad/VrsteOtpada";
import NewVrstaOtpada from "../pages/Otpad/NewVrstaOtpada";
import Proizvodi from "../pages/Otpad/Proizvodi";
import NewProizvod from "../pages/Otpad/NewProizvod";
import NewJCI from "../pages/Otpad/NewJCI";
import EvidencijaJCI from "../pages/Otpad/EvidencijaJCI";
import DelovodnaKnjiga from "../pages/Otpad/DelovodnaKnjiga";
import PersistLogin from "./PersistLogin";
import Odsustva from "../pages/Odsustva/Odsustva";
import EvidencijaOdsustva from "../pages/Odsustva/EvidencijaOdsustva";
import DodeljivanjeOdsustva from "../pages/Odsustva/DodeljivanjeOdsustva";
import NewDodeljivanjeOdsustva from "../pages/Odsustva/NewDodeljivanjeOdsustva";
import OdobravanjeOdsustva from "../pages/Odsustva/OdobravanjeOdsustva";
import ResenjeOdmor from "../pages/Odsustva/ResenjeOdmor";
import { Priviledges } from "../config/appConfig.js";
import Administrator from "../pages/Odsustva/Administrator";
import Racuni from "../pages/Racuni/Racuni";
import NabavkeProizvodi from "../pages/Nabavke/Proizvodi";
import NewNabavkaProizvod from "../pages/Nabavke/NewProizvod";
import NewPorudzbina from "../pages/Nabavke/NewPorudzbina";
import AktivnePorudzbine from "../pages/Nabavke/Porudzbine.js";
import StampaResenja from "../pages/Odsustva/StampaResenja";
import SuperAdmin from "../pages/User/SuperAdmin";
import Pregled from "../pages/Nabavke/Pregled";
import SlanjeSMS from "../pages/Reklamacije/SlanjeSMS";
import Login from "../pages/Login";

const SiteRoutes = () => {
  return (
    <Routes>
      {/*Public Rotutes*/}

      {/* Reklamacije Public Route */}
      <Route path="reklamacije/pregled-reklamacije/:id" element={<PregledReklamacije />} />
      <Route path="login" element={<Login />} />

      {/* Private Rotutes */}

      <Route element={<PersistLogin />}>
        {/* Odmor template za stampu */}

        <Route element={<ProtectRoute minRole={Priviledges["/odsustva/resenje-odmor/:id"]} />}>
          <Route path="odsustva/resenje-odmor/:id" element={<ResenjeOdmor />} />
        </Route>

        {/* Home Route */}

        <Route path="/" element={<Home />} />

        {/* Nabavke Routes */}
        <Route element={<ProtectRoute minRole={Priviledges["/nabavke"]} />}>
          <Route path="nabavke" element={<Nabavke />}>
            <Route element={<ProtectRoute minRole={Priviledges["/nabavke/porudzbine"]} />}>
              <Route path="porudzbine" element={<AktivnePorudzbine />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/nabavke/nova-porudzbina"]} />}>
              <Route path="nova-porudzbina" element={<NewPorudzbina />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/nabavke/pregled"]} />}>
              <Route path="pregled" element={<Pregled />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/nabavke/proizvodi"]} />}>
              <Route path="proizvodi" element={<NabavkeProizvodi />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/nabavke/nov-proizvod"]} />}>
              <Route path="nov-proizvod" element={<NewNabavkaProizvod />} />
            </Route>
          </Route>
        </Route>

        {/* Odsustva Routes */}

        <Route element={<ProtectRoute minRole={Priviledges["/odsustva"]} />}>
          <Route path="odsustva" element={<Odsustva />}>
            <Route element={<ProtectRoute minRole={Priviledges["/odsustva/evidencija"]} />}>
              <Route path="evidencija" element={<EvidencijaOdsustva />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/odsustva/stampa"]} />}>
              <Route path="stampa" element={<StampaResenja />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/odsustva/odobravanje"]} />}>
              <Route path="odobravanje" element={<OdobravanjeOdsustva />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/odsustva/dodeljivanje"]} />}>
              <Route path="dodeljivanje" element={<DodeljivanjeOdsustva />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/odsustva/novo-dodeljivanje"]} />}>
              <Route path="novo-dodeljivanje" element={<NewDodeljivanjeOdsustva />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/odsustva/administrator"]} />}>
              <Route path="administrator" element={<Administrator />} />
            </Route>
          </Route>
        </Route>

        {/* Otpad Routes */}
        <Route element={<ProtectRoute minRole={Priviledges["/otpad"]} />}>
          <Route path="otpad" element={<Otpad />}>
            <Route element={<ProtectRoute minRole={Priviledges["/otpad/evidencija"]} />}>
              <Route path="evidencija" element={<EvidencijaJCI />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/otpad/nova-jci"]} />}>
              <Route path="nova-jci" element={<NewJCI />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/otpad/delovodna-knjiga"]} />}>
              <Route path="delovodna-knjiga" element={<DelovodnaKnjiga />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/otpad/proizvodi"]} />}>
              <Route path="proizvodi" element={<Proizvodi />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/otpad/nov-proizvod"]} />}>
              <Route path="nov-proizvod" element={<NewProizvod />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/otpad/vrste-otpada"]} />}>
              <Route path="vrste-otpada" element={<VrsteOtpada />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/otpad/nova-vrsta-otpada"]} />}>
              <Route path="nova-vrsta-otpada" element={<NewVrstaOtpada />} />
            </Route>
          </Route>
        </Route>

        {/* Reklamacije Routes */}
        <Route element={<ProtectRoute minRole={Priviledges["/reklamacije"]} />}>
          <Route path="reklamacije" element={<Reklamacije />}>
            <Route element={<ProtectRoute minRole={Priviledges["/reklamacije/prijem-reklamacija"]} />}>
              <Route path="prijem-reklamacija" element={<PrijemReklamacija />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/reklamacije/nova-reklamacija"]} />}>
              <Route path="nova-reklamacija" element={<NovaReklamacija />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/reklamacije/obrada-reklamacija"]} />}>
              <Route path="obrada-reklamacija" element={<ObradaReklamacija />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/reklamacije/slanje-sms"]} />}>
              <Route path="slanje-sms" element={<SlanjeSMS />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/reklamacije/delovodnik"]} />}>
              <Route path="delovodnik" element={<DelovodnikReklamacija />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/reklamacije/administrator"]} />}>
              <Route path="administrator" element={<Administrtator />} />
            </Route>
          </Route>
        </Route>

        {/* Računi Routes */}
        <Route element={<ProtectRoute minRole={Priviledges["/racuni"]} />}>
          <Route path="racuni" element={<Racuni />} />
        </Route>

        {/* User routes */}
        <Route element={<ProtectRoute minRole={Priviledges["/users"]} />}>
          <Route path="users" element={<Users />}>
            <Route element={<ProtectRoute minRole={Priviledges["/users/dashboard"]} />}>
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/users/new-user"]} />}>
              <Route path="new-user" element={<NewUser />} />
            </Route>
            <Route element={<ProtectRoute minRole={Priviledges["/users/super-admin"]} />}>
              <Route path="super-admin" element={<SuperAdmin />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default SiteRoutes;
