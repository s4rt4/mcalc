import type { Category, Tool } from "../types";
import { geometri } from "./geometri";
import { konversi } from "./konversi";
import { matematika } from "./matematika";
import { finansial } from "./finansial";
import { kesehatan } from "./kesehatan";
import { tanggal } from "./tanggal";
import geoIcon from "../../../svg/geometri.svg?raw";
import konvIcon from "../../../svg/konversi.svg?raw";
import matIcon from "../../../svg/matematika.svg?raw";
import finIcon from "../../../svg/finansial.svg?raw";
import sehatIcon from "../../../svg/heart-plus.svg?raw";
import tglIcon from "../../../svg/calendar-days.svg?raw";

export const categories: Category[] = [
  { id: "geo", label: "Geometri", icon: geoIcon },
  { id: "konv", label: "Konversi", icon: konvIcon },
  { id: "mat", label: "Matematika", icon: matIcon },
  { id: "fin", label: "Finansial", icon: finIcon },
  { id: "sehat", label: "Kesehatan", icon: sehatIcon },
  { id: "tgl", label: "Tanggal", icon: tglIcon },
];

export const tools: Tool[] = [
  ...geometri,
  ...konversi,
  ...matematika,
  ...finansial,
  ...kesehatan,
  ...tanggal,
];

export const toolsByCat = (cat: string): Tool[] => tools.filter((t) => t.cat === cat);
