import {
  ArrowArcRight,
  ArrowsCounterClockwise,
  FastForward,
  Gear,
  Play,
} from "@phosphor-icons/react";
import GlobalHitImage from "../../assets/globalhit.png";
import HistoryImage from "../../assets/history.png";

export const Empty = () => {
  return (
    <>
      <div className="text-center text-gray-800 mb-12">
        <svg
          className="w-32 h-32 mx-auto mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Get Started with Memory Cache Simulation
        </h2>
        <p className="text-xl text-gray-600">
          Follow these steps to begin your simulation journey
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Step 1: Configure Cache
          </h3>
          <p className="text-gray-600">
            Select or configure your cache parameters to begin the simulation.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Step 2: Select Program
          </h3>
          <p className="text-gray-600">
            Choose a pre-defined program or upload your own to run in the
            simulator.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Step 3: Control Simulation
          </h3>
          <div className="flex justify-around items-center mt-6">
            {[
              { icon: Gear, label: "Settings" },
              { icon: ArrowsCounterClockwise, label: "Reset" },
              { icon: FastForward, label: "Fast Forward" },
              { icon: ArrowArcRight, label: "Step" },
              { icon: Play, label: "Play/Pause" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center ">
                <div className="p-3 bg-gray-100 rounded-full duration-300">
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-sm text-gray-600 mt-2duration-300">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md lg transition-shadow duration-300">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Understanding the Simulation screen
          </h3>
          {/* <p className="text-gray-600">
            Na parte superior da tela são exibidas as informações do acesso
            atual. O painel GLOBAL apresenta o ciclo da simulação, o endereço de
            memória acessado, o número da instrução executada, o tempo acumulado
            de execução e o resultado do acesso (Hit ou Miss). Essas informações
            permitem identificar qual instrução está sendo executada e o impacto
            desse acesso no desempenho do sistema. Logo abaixo, o painel da L1
            Cache mostra como o endereço foi interpretado pela cache. São
            apresentados os campos Tag, Set e Block Index, obtidos a partir da
            divisão do endereço conforme a organização da cache configurada pelo
            usuário. Além disso, são exibidos a taxa de acertos (Hit Rate), o
            tempo médio de acesso (Average Access Time) e o resultado do acesso
            atual. Na região central da tela encontra-se a representação dos
            conjuntos (sets) da cache. Cada conjunto apresenta seus respectivos
            blocos (ways), indicando informações como: Valid: informa se o bloco
            contém dados válidos; Tag: valor utilizado para identificar se o
            bloco corresponde ao endereço solicitado; Memory Range: intervalo de
            endereços armazenado naquele bloco; Load: ciclo em que o bloco foi
            carregado na cache; Last Access: último ciclo em que o bloco foi
            utilizado. Durante a simulação, o conjunto acessado é destacado
            visualmente, permitindo identificar rapidamente onde ocorreu a busca
            e, em caso de substituição, qual bloco foi atualizado.
          </p> */}
          <img
            src={GlobalHitImage}
            alt="GLOBAL panel"
            className="mx-auto p-4 rounded-md shadow-sm"
          />
          <ul>
            <li>
              The GLOBAL panel provides an overview of the current access,
              including the simulation cycle, accessed memory address, executed
              instruction number, accumulated execution time, and access result
              (Hit or Miss).
            </li>
            <li>
              This information helps identify which instruction is being
              executed and its impact on system performance.
            </li>
            <li>
              Below that, the L1 Cache panel shows how the address was
              interpreted by the cache, displaying fields like Tag, Set, and
              Block Index based on the cache organization configured by the
              user.
            </li>
            <li>
              It also shows hit rate, average access time, and the current
              access result.
            </li>
          </ul>
          <img
            src={HistoryImage}
            alt="Cache History Panel"
            className="mx-auto p-4 rounded-md shadow-sm"
          />
          <p>
            In the central area of the screen, sets of the cache are
            represented, with each set showing its respective blocks (ways) and
            their details such as Validity, Tag, Memory Range, Load cycle, and
            Last Access cycle. During simulation, the accessed set is visually
            highlighted for easy identification of where the search occurred and
            which block was updated in case of replacement.
          </p>

          {/* <dl>
            <dt>Coffee</dt>
            <dd>- black hot drink</dd>
            <dt>Milk</dt>
            <dd>- white cold drink</dd>
          </dl> */}
        </div>
      </div>
      <div style={{ height: "100px" }}></div>
    </>
  );
};
