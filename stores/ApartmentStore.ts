import { defineStore } from "pinia";

import type {
  IApartment,
  IApartmentFilter,
  IApartmentSortName,
  IApartmentSortOrder,
  IApartmentSortOption,
} from "~/types/apartment";

import apartmentsData from "@/public/data/apartments.json";

const ITEMS_LIMIT = 20;

const ROOM = 2;
const METERS = [33, 123];
const PRICE = [5500000, 180009000];
const APARTMENT_FILTER = "apartment-filter";

export const useApartmentStore = defineStore("apartmentStore", () => {
  const itemsLimit = ref<number>(ITEMS_LIMIT);

  const filter = ref<IApartmentFilter>({
    room: ROOM,
    price: PRICE,
    meters: METERS,
  });

  const savedFilter = ref<IApartmentFilter | undefined>();

  const sort = ref<IApartmentSortOption[]>([
    { name: "meters", isSort: false, order: "ASC" },
    { name: "floor", isSort: false, order: "ASC" },
    { name: "price", isSort: true, order: "ASC" },
  ]);

  const { data, pending, error } = useAsyncData("apartments", async () => apartmentsData, {
    default: () => [],
  });

  if (error.value) {
    console.error("An error occurred while fetching apartments:", error.value);
  }

  const isLoading = computed(() => pending.value || !itemsLimit.value);

  const rooms = computed(() => {
    const roomNumbers = [...data.value].map((a) => a.room).sort((a: number, b: number) => a - b);
    return [...new Set(roomNumbers)];
  });

  const priceRange = computed(() => {
    const min = Math.min(...data.value.map((a) => a.price));
    const max = Math.max(...data.value.map((a) => a.price));
    return { min, max };
  });

  const metersRange = computed(() => {
    const min = Math.min(...data.value.map((a) => a.meters));
    const max = Math.max(...data.value.map((a) => a.meters));
    return { min, max };
  });

  const slicedData = computed((): IApartment[] => {
    return data.value.slice(0, itemsLimit.value);
  });

  const setOrder = (name: IApartmentSortName) => {
    sort.value = sort.value.map((s) => {
      if (s.name === name) {
        s.order = s.order === "ASC" ? "DESC" : "ASC";
        s.isSort = true;
      } else {
        s.isSort = false;
      }
      return s;
    });
  };

  const getOrder = (name: IApartmentSortName): IApartmentSortOrder => {
    return sort.value.find((s) => s.name === name)?.order ?? "ASC";
  };

  const getSorted = (data: IApartment[]) => {
    const currentSort = sort.value.find((s) => s.isSort);

    return data.sort((a, b) => {
      const sortCriteria = currentSort ? currentSort.name : "price";
      const aValue = a[sortCriteria];
      const bValue = b[sortCriteria];

      if (currentSort && currentSort.order === "ASC") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const setItemsLimit = () => {
    const limit = itemsLimit.value + itemsLimit.value;
    itemsLimit.value = itemsLimit.value >= data.value.length ? itemsLimit.value : limit;
  };

  const saveFilterToLocalStorage = () => {
    if (savedFilter.value) {
      localStorage.setItem(APARTMENT_FILTER, JSON.stringify(filter.value));
    }
  };

  const getFilterFromLocalStorage = (): IApartmentFilter | undefined => {
    const json = localStorage.getItem(APARTMENT_FILTER);
    return json ? JSON.parse(json) : undefined;
  };

  const resetFilter = () => {
    itemsLimit.value = ITEMS_LIMIT;

    filter.value = {
      room: ROOM,
      meters: METERS,
      price: PRICE,
    };
  };

  const setFilter = () => {
    const filterInit = getFilterFromLocalStorage() || filter.value;

    savedFilter.value = filterInit;
    filter.value = filterInit;
  };

  watch(filter, saveFilterToLocalStorage, { deep: true });

  onMounted(() => {
    setFilter();
  });

  return {
    ITEMS_LIMIT,

    isLoading,

    data,
    slicedData,

    itemsLimit,
    filter,
    priceRange,
    metersRange,
    rooms,

    getOrder,
    setOrder,
    getSorted,
    setItemsLimit,
    resetFilter,
  };
});
