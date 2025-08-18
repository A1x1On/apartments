<template>
  <div class="list-page">
    <div class="list-page__content">
      <h1 class="list-page__content-title">Квартиры</h1>

      <div v-if="apartmentStore.isLoading" class="loader"></div>
      <div v-else-if="items.length" class="list-page__content-table">
        <div class="list-page__content-table-header">
          <div class="list-page__content-table-header-prev">Планировка</div>

          <div class="list-page__content-table-header-title">Квартира</div>

          <VSortColumnBtn
            class="list-page__content-table-header-meters"
            text="S, м²"
            :order="apartmentStore.getOrder('meters')"
            @click="apartmentStore.setOrder('meters')"
          />

          <VSortColumnBtn
            class="list-page__content-table-header-floor"
            text="Этаж"
            :order="apartmentStore.getOrder('floor')"
            @click="apartmentStore.setOrder('floor')"
          />

          <VSortColumnBtn
            class="list-page__content-table-header-price"
            text="Цена, ₽"
            :order="apartmentStore.getOrder('price')"
            @click="apartmentStore.setOrder('price')"
          />
        </div>
        <div class="list-page__content-table-body">
          <div v-for="item in items" class="list-page__content-table-body-row">
            <div class="list-page__content-table-body-row-prev">
              <img class="list-page__content-table-body-row-prev-img" :src="item.url" />
            </div>

            <div class="list-page__content-table-body-row-title">{{ item.title }}</div>

            <div class="list-page__content-table-body-row-meters">{{ item.meters }}</div>

            <div class="list-page__content-table-body-row-floor">
              {{ item.floor }} <span class="text-gray-o"> из {{ item.floors }}</span>
            </div>

            <div class="list-page__content-table-body-row-price">
              {{ item.price }}
            </div>
          </div>

          <div v-for="item in items" class="list-page__content-table-body-row-mini">
            <div class="list-page__content-table-body-row-mini-detail">
              <div class="list-page__content-table-body-row-mini-title">{{ item.title }}</div>
              <div class="list-page__content-table-body-row-mini-detail-numbers">
                <div class="list-page__content-table-body-row-mini-meters">{{ item.meters }} м²</div>

                <div class="list-page__content-table-body-row-mini-floor">
                  {{ item.floor }} <span class="text-gray-o"> из {{ item.floors }} этаж</span>
                </div>

                <div class="list-page__content-table-body-row-mini-price">{{ item.price }} ₽</div>
              </div>
            </div>

            <div class="list-page__content-table-body-row-mini-prev">
              <img class="list-page__content-table-body-row-mini-prev-img" :src="item.url" />
            </div>
          </div>
        </div>
      </div>
      <div v-else="!items.length">Не одной квартиры не найдено, попробуйте изменить фильтр &#128155;</div>

      <div class="list-page__content-panel">
        <button
          v-if="!apartmentStore.isLoading && isAvailability"
          class="list-page__content-panel-fetcher-btn"
          :class="isAvailability ? '' : 'list-page__content-panel-fetcher-btn--disabled'"
          @click="onFetch"
        >
          Показать ещё 20
        </button>
      </div>
    </div>
    <div class="list-page__filter">
      <div class="list-page__filter-panel">
        <div class="list-page__filter-panel-rooms">
          <div
            v-for="room in apartmentStore.rooms"
            class="list-page__filter-panel-rooms-room"
            :class="apartmentStore.filter.room === room ? 'list-page__filter-panel-rooms-room--active' : ''"
            @click="onFilterByRoom(room)"
          >
            {{ room }}к
          </div>
        </div>

        <div class="list-page__filter-panel-slider-block">
          <div>Стоимость квартиры, ₽</div>

          <div class="list-page__filter-panel-slider-block-label">
            <div><span class="text-gray-o">от</span> {{ apartmentStore.filter.price[0] }}</div>

            <div><span class="text-gray-o">до</span> {{ apartmentStore.filter.price[1] }}</div>
          </div>

          <USlider
            v-model="apartmentStore.filter.price"
            :min="apartmentStore.priceRange.min"
            :max="apartmentStore.priceRange.max"
            size="xs"
          />
        </div>

        <div class="list-page__filter-panel-slider-block">
          <div>Площадь, м²</div>

          <div class="list-page__filter-panel-slider-block-label">
            <div><span class="text-gray-o">от</span> {{ apartmentStore.filter.meters[0] }}</div>

            <div><span class="text-gray-o">до</span> {{ apartmentStore.filter.meters[1] }}</div>
          </div>

          <USlider
            v-model="apartmentStore.filter.meters"
            :min="apartmentStore.metersRange.min"
            :max="apartmentStore.metersRange.max"
            :step="0.1"
            size="xs"
          />
        </div>

        <button class="list-page__filter-panel-reset-btn" @click="onResetFilter">
          <span>Сбросить параметры</span>
          <div class="list-page__filter-panel-reset-btn-cross"></div>
        </button>
      </div>
    </div>

    <VScrollBtn />
  </div>
</template>

<script lang="ts">
import { useApartmentStore } from "@/stores/ApartmentStore";
import { formatCurrency } from "@/helpers/helper";

import type { IApartment, IApartmentMap } from "~/types/apartment";

useSeoMeta({
  title: "Квартиры в продаже | Найдите свою идеальную квартиру",
  description:
    "Ищите квартиры для покупки? Просмотрите актуальные предложения по квартирам в вашем городе. Фильтруйте по цене, площади и этажу.",
  ogTitle: "Квартиры в продаже | Найдите свою идеальную квартиру",
  ogDescription:
    "Просмотрите наш каталог квартир, отобранных по самым важным критериям. Сортировка по цене, этажу и площади.",
  ogImage: "/img/apartments/preview-1.png",
  ogUrl: "https://example.com/kvartiry",
});

export default defineComponent({
  setup() {
    const apartmentStore = useApartmentStore();

    const isAvailability = computed(() => {
      const filtered = filter();
      return apartmentStore.itemsLimit < filtered.length;
    });

    const items = computed((): IApartmentMap[] => {
      const filtered = filter();
      const sliced = filtered.slice(0, apartmentStore.itemsLimit);

      const sortedData = apartmentStore.getSorted([...sliced]);
      return getMappedData(sortedData);
    });

    const filter = () => {
      return apartmentStore.data.filter(
        (f) =>
          f.room === apartmentStore.filter.room &&
          f.price >= apartmentStore.filter.price[0] &&
          f.price <= apartmentStore.filter.price[1] &&
          f.meters >= apartmentStore.filter.meters[0] &&
          f.meters <= apartmentStore.filter.meters[1],
      );
    };

    const getMappedData = (data: IApartment[]) => {
      return data.map((item: IApartment) => {
        const { meters, price, ...rest } = item;
        return {
          ...rest,
          meters: meters.toString().replace(".", ","),
          price: formatCurrency(price),
        } as IApartmentMap;
      });
    };

    const onFilterByRoom = (room: number) => {
      apartmentStore.itemsLimit = apartmentStore.ITEMS_LIMIT;
      apartmentStore.filter.room = room;
    };

    const onResetFilter = () => {
      apartmentStore.resetFilter();
    };

    const onFetch = () => {
      apartmentStore.setItemsLimit();
    };

    return {
      apartmentStore,

      isAvailability,
      items,

      onFilterByRoom,
      onResetFilter,
      onFetch,
    };
  },
});
</script>

<style lang="scss" scoped>
.list-page {
  display: flex;
  max-width: 1280px;
  min-height: 200px;
  margin: auto;
  gap: 28px;

  &__content {
    width: 100%;

    &-title {
      font-weight: 700;
      line-height: 55px;
      font-size: var(--fs-xxl);
      margin: 2px 0px 48px 0px;
    }

    &-table {
      width: 100%;
      max-width: 801px;
      min-width: 506px;

      &-header {
        width: 100%;
        display: flex;
        gap: 20px;
        height: 36px;
        border-bottom: 1px solid var(--border-color-1);

        &-prev {
          min-width: 80px;
        }

        &-title {
          min-width: 281px;
        }

        &-meters {
          min-width: 120px;
        }

        &-floor {
          min-width: 120px;
        }

        &-price {
          min-width: 120px;
        }
      }

      &-body {
        width: 100%;

        &-row-mini {
          display: none;
        }

        &-row {
          display: flex;
          gap: 20px;
          border-bottom: 1px solid var(--border-color-1);
          min-height: 119px;
          padding: 15px 15px 15px 0px;

          &-prev {
            min-width: 80px;
            padding: 7px;

            &-img {
              width: -webkit-fill-available;
            }
          }

          &-title {
            min-width: 281px;
            font-size: var(--fs-md);
          }

          &-meters {
            min-width: 120px;
            font-size: var(--fs-md);
          }

          &-floor {
            min-width: 120px;
            font-size: var(--fs-md);
          }

          &-price {
            min-width: 120px;
            font-size: var(--fs-md);
          }
        }
      }
    }

    &-panel {
      padding-top: 48px;

      &-fetcher-btn {
        font-size: var(--fs-md);
        text-align: center;
        padding: 10px 25px;
        border: 1px solid var(--border-color-2);
        border-radius: 25px;
        cursor: pointer;

        &:hover {
          opacity: 0.6;
        }
      }
    }
  }

  &__filter {
    width: 100%;
    max-width: 399px;
    min-width: 318px;
    padding-bottom: 100px;
    &-panel {
      background: var(--gradient-1);

      border-radius: 10px;
      height: 372px;
      width: 100%;
      padding: 40px;

      &-rooms {
        display: flex;
        gap: 16px;
        margin-bottom: 25px;

        &-room {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          font-size: var(--fs-md);
          border-radius: 200px;
          color: var(--gray-dark);
          background-color: var(--white);
          cursor: pointer;

          &:hover {
            color: var(--white);
            background-color: var(--green-light);
            box-shadow: 0px 6px 20px 0px var(--shadow-green);
          }
        }

        &-room--active {
          color: var(--white);
          background-color: var(--green);
          box-shadow: 0px 6px 20px 0px var(--shadow-green);
        }

        &-room--disabled {
          background-color: var(--white);
          color: var(--gray-dark);
        }
      }

      &-slider-block {
        display: flex;
        flex-direction: column;
        min-height: 80px;
        justify-content: space-around;
        margin-bottom: 20px;

        &-label {
          padding-right: 50px;
          display: flex;
          font-size: var(--fs-md);
          justify-content: space-between;
          padding-bottom: 5px;
        }
      }

      &-reset-btn {
        display: inline-flex;
        gap: 5px;
        line-height: 9px;
        margin: 15px 0px 0px 15px;
        cursor: pointer;

        &:hover {
          opacity: 0.6;
        }

        &-cross {
          position: relative;
          width: 10px;
          height: 10px;
        }

        &-cross::before,
        &-cross::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 1.5px;
          background-color: var(--gray-dark);
          border-radius: 2px;
          transform-origin: center;
        }

        &-cross::before {
          transform: translate(-50%, -50%) rotate(45deg);
        }

        &-cross::after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }
      }
    }
  }
}

@media (max-width: 1439px) {
  .list-page {
    &__content {
      &-table {
        &-header {
          border-bottom: none;

          &-prev {
            display: none;
          }

          &-title {
            display: none;
          }

          &-meters {
            min-width: 45px;
          }

          &-floor {
            min-width: 50px;
          }

          &-price {
            min-width: 65px;
          }
        }

        &-body {
          &-row {
            display: none;
          }

          &-row-mini {
            display: flex;
            gap: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            margin-bottom: 4px;
            border: 1px solid var(--border-color-1);
            justify-content: space-between;

            &-title {
              margin-bottom: 16px;
            }

            &-detail {
              width: 100%;

              &-numbers {
                display: flex;
                gap: 20px;
              }
            }

            &-prev {
              min-width: 80px;
              padding: 7px;

              &-img {
                width: -webkit-fill-available;
              }
            }
          }
        }
      }

      &-panel {
        padding-top: 20px;
      }
    }

    &__filter {
      &-panel {
        padding: 19px;
        height: 318px;

        &-rooms {
          margin-bottom: 20px;
        }

        &-slider-block {
          min-height: 75px;
        }

        &-reset-btn {
          margin: 0px 0px 0px 15px;
        }
      }
    }
  }
}
</style>
