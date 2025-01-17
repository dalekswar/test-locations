import { useState } from "react";
import { useLocationsStore } from "./store/useLocationsStore";

interface TestLocation {
  locationID?: number;
  environmentID?: number;
  hint?: string;
}

export default function App() {
  return (
    <div className="App">
      <TestLocationsList />
    </div>
  );
}

const TestLocationsList = () => {
  const store = useLocationsStore();
  const [locationsList, setLocationsList] = useState<TestLocation[]>([{}]);

  // Проверяем, если данные еще не загружены
  if (!store.isLoaded) {
    store.fetch(); // Запускаем загрузку данных
    return <div>Загрузка данных...</div>; // Отображаем сообщение о загрузке
  }

  return (
    <div className="locations-container">
      {locationsList.map((location, index) => (
        <TestLocationForm
          key={`location-${index}`}
          index={index}
          locationData={location}
          onUpdate={(updatedLocation) =>
            setLocationsList((prev) =>
              prev.map((loc, i) => (i === index ? updatedLocation : loc))
            )
          }
          onRemove={() =>
            setLocationsList((prev) =>
              prev.filter((_loc, i) => i !== index)
            )
          }
        />
      ))}
      <div className="buttons-container">
        <button
          className="add-location-button"
          type="button"
          onClick={() => setLocationsList((prev) => [...prev, {}])}
        >
          <i className="fas fa-plus"></i> Добавить тестовую локацию
        </button>
        <button
          className="console-button"
          onClick={() => console.log(locationsList)}
        >
          Вывести результат в консоль
        </button>
      </div>
    </div>
  );
};





const TestLocationForm = ({
  index,
  locationData,
  onUpdate,
  onRemove,
}: {
  index: number;
  locationData: TestLocation;
  onUpdate: (data: TestLocation) => void;
  onRemove: () => void;
}) => {
  const store = useLocationsStore();

  const filteredEnvironments = store.servers
    .filter((server) => server.locationID === locationData.locationID)
    .map((server) => store.environments.find((env) => env.environmentID === server.environmentID))
    .filter((env, index, self) => env && self.indexOf(env) === index);

  const servers = store.servers
    .filter(
      (server) =>
        server.locationID === locationData.locationID &&
        server.environmentID === locationData.environmentID
    )
    .map((server) => server.name)
    .join(", ");

  return (
    <div className="test-location-form">
      <div className="form-header">
        <h3>
          <i className="fas fa-pencil-alt"></i> Тестовая локация {index + 1}
        </h3>
        <button className="remove-button" type="button" onClick={onRemove}>
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
      <div className="form-inline">
        <div className="form-item">
          <label>
            <i className="fas fa-map-marker-alt"></i> Локация:
          </label>
          <select
            value={locationData.locationID || ""}
            onChange={(e) =>
              onUpdate({
                ...locationData,
                locationID: Number(e.target.value),
                environmentID: undefined,
              })
            }
          >
            <option value="">Выберите локацию</option>
            {store.locations.map((location) => (
              <option key={location.locationID} value={location.locationID}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-item">
          <label>
            <i className="fas fa-leaf"></i> Среда:
          </label>
          <select
            value={locationData.environmentID || ""}
            onChange={(e) =>
              onUpdate({
                ...locationData,
                environmentID: Number(e.target.value),
              })
            }
            disabled={!locationData.locationID}
          >
            <option value="">Выберите среду</option>
            {filteredEnvironments.map(
              (env) =>
                env && (
                  <option key={env.environmentID} value={env.environmentID}>
                    {env.name}
                  </option>
                )
            )}
          </select>
        </div>
        <div className="form-item">
          <label>
            <i className="fas fa-server"></i> Серверы:
          </label>
          <span className="servers">{servers || "Нет доступных серверов"}</span>
        </div>
      </div>
      <div className="form-hint">
        <label>
          <i className="fas fa-question-circle"></i> Подсказка:
        </label>
        <input
          type="text"
          value={locationData.hint || ""}
          onChange={(e) =>
            onUpdate({
              ...locationData,
              hint: e.target.value,
            })
          }
          placeholder="Комментарий по локации"
        />
      </div>
    </div>
  );
};








