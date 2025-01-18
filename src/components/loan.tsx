import { useAbstraxionSigningClient } from "@burnt-labs/abstraxion";
import { useState } from "react";

const Loan = ({
  closeModal,
  score,
}: {
  closeModal: () => void;
  score: number | null;
}) => {
  const { client } = useAbstraxionSigningClient();

  const [newLoan, setNewLoan] = useState({
    amount: 0,
    score,
    collateral: 0
  });

  const getCollateral = async (value: any) => {
    if (client) {
      const queryMsg = {
        get_value: {},
      };

      try {
        // Query the contract and log full response
        const result = await client.queryContractSmart(
          "xion1urex43fr9zsez3393lfqnhedkvdscja7957dkpxx3s0jc9gzrewq9hhwe4",
          queryMsg
        );
        console.log("Result:", result);
        if (result) {
          setNewLoan((prev) => ({
            ...prev,
            collateral:  parseInt(value) * (result - (score || 0)) / result
          }));
        }
      } catch (error: any) {
        console.error("Error querying contract:", error);
        if (error.message) {
          console.error("Error message:", error.message);
        }
        if (error.response) {
          console.error("Error response:", error.response);
        }
      }
    }
  };

  const handleInputChange = async (e: any) => {
    const { name, value } = e.target;
    setNewLoan((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "amount") {
      await getCollateral(value)
    }
  };

  const requestLoan = () => {
    if (newLoan.amount <= 0) {
      alert("Please enter valid loan amount.");
      return;
    }

    console.log("Loan Requested:", newLoan);

    setNewLoan({ amount: 0, score, collateral: 0 });
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="border bg-black p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold text-white mb-4">Request Loan</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            requestLoan();
          }}
        >
          <div className="mb-4">
            <label className="text-white block mb-2" htmlFor="amount">
              Loan Amount (in XION)
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={newLoan.amount}
              onChange={handleInputChange}
              className="w-full p-3 bg-transparent border text-white rounded-md"
              placeholder="Enter loan amount"
            />
          </div>
          <div className="mb-4">
            <label className="text-white block mb-2" htmlFor="score">
              Your Trust Score
            </label>
            <input
              id="score"
              name="score"
              type="number"
              value={newLoan.score || 0}
              onChange={handleInputChange}
              disabled
              className="w-full p-3 bg-gray-900 border text-white rounded-md"
              placeholder="Your Trust Score"
            />
          </div>
          <div className="mb-4">
            <label className="text-white block mb-2" htmlFor="collateral">
              Collateral Required (in USDC) (please enter the amount and wait for the value to be fetched)
            </label>
            <input
              id="collateral"
              name="collateral"
              type="number"
              value={(newLoan.collateral) || 0}
              onChange={handleInputChange}
              disabled
              className="w-full p-3 bg-gray-900 border text-white rounded-md"
              placeholder="Collateral Required"
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-blue-800 text-white rounded-md"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
              Submit Loan Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Loan;
