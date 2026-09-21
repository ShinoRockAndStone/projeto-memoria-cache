import {
  ArrowArcRight,
  ArrowsCounterClockwise,
  FastForward,
  Gear,
  Play,
} from "@phosphor-icons/react";
import Tutorialzero from "../../assets/tutorialzero.png";
import Tutorialone from "../../assets/tutorialone.png";
import Tutorialtwo from "../../assets/tutorialtwo.png";

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
            Following the Cache's Execution
          </h3>
          <ul className="bullet-points-tutorial">
            <li>
              CacheLab's simulation screen shows the cache's current state in
              the middle and the access history on the right. This overview
              allows not only to see whether an access resulted in a Hit or Miss
              (indicated by the colors green and red, respectively), but also
              how each access affects the cache's content throughout it's
              execution.
            </li>
          </ul>
          <img
            src={Tutorialzero}
            alt="full"
            className="mx-auto p-4 rounded-md shadow-sm"
          />
          <ul className="bullet-points-tutorial">
            <li>
              In the example, the simulation is in Cycle 8 by the time the
              processor accesses the address 0x1FFF000C00. It's telling that
              this access resulted in a Hit, meaning that the data was already
              present in the cache, more especifically in L1.
            </li>
            <li>
              The address is divided into Tag, Set and Block Index, wich are
              used to determine where the address must be searched in the cache.
              The values for the current access are:
            </li>
            <ul className="bullet-points-tutorial-secondary">
              <li>Tag: 0x3FFE001</li>
              <li>Set: 16</li>
              <li>Block Index: 0</li>
            </ul>
          </ul>
          <img
            src={Tutorialone}
            alt="center"
            className="mx-auto p-4 rounded-md shadow-sm"
          />
          <ul className="bullet-points-tutorial">
            <li>
              Each Set represents a group of cache lines, and the Block Index
              indicates which line within the Set contains the data. In this
              case, the data is found in Set 16, Line 0, confirming that the
              access was a Hit.
            </li>
            <li>
              In the middle, it shows the Set's information:
              <ul className="bullet-points-tutorial-secondary">
                <li>Block: identifies the cache line.</li>
                <li>Valid: indicates if the cache line is valid.</li>
                <li>
                  Tag: identifies what part of the address is stored in the
                  Block.
                </li>
                <li>
                  Memory Range: indicates the range of memory addresses stored
                  in the Block.
                </li>
                <li>
                  Load: indicates the Cycle when the cache line was loaded into
                  the cache.
                </li>
                <li>
                  Last Access: indicates the most recent Cycle when the block
                  was accessed.
                </li>
              </ul>
            </li>
            <li>
              In Set 16, the Block has the Tag 0x3FFE001 and since the current
              access (Cycle 8) has the same combinations of Tag and Set, the
              simulation is able to locate the Block in the cache, resulting in
              a Hit.
            </li>
            <li>
              The others Sets (30 and 31) are also shown in the image because
              they've been used before in the simulation.
            </li>
          </ul>
          <img
            src={Tutorialtwo}
            alt="right"
            className="mx-auto p-4 rounded-md shadow-sm"
          />
          <ul className="bullet-points-tutorial">
            <li>
              The right panel (image above) is the access history of the
              simulation. Each card informs the Cycle, the address accessed, the
              result of the access (Hit or Miss) and the fields utilized to
              locate de address.
            </li>
            <li>
              This history helps relate the information presentes in the middle
              screen. For example:
              <ul className="bullet-points-tutorial-secondary">
                <li>
                  In Cyclo 0, it tries to access 0x1FFF00C30, resulting in a
                  Miss. However, that miss makes the cache load the Block
                  containing a range of addressess.
                </li>
                <li>
                  The addresses loaded due to the Miss in Cycle 0 include
                  0x1FFF00C30, 0x1FFF000C28, 0x1FFF000C08 and 0x1FFF000C00.
                  Thanks to that, Cycles 1, 2, 4, 5, 7 and 8 results in Hits.
                </li>
                <li>
                  In Cycle 3, the address 0x10BFC0 results in a Miss. The
                  corresponding Block is then loaded into Set 31.
                </li>
                <li>
                  In Cycle 6, the address 0x10BFB8 also results in a Miss, wich
                  leads into the load of a Block in Set 30.
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div style={{ height: "100px" }}></div>
    </>
  );
};
