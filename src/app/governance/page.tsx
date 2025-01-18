"use client";
import Header from "@/components/header";
import { useState } from "react";
import { JSX } from "react";

type Proposal = {
  id: string;
  title: string;
  description: string;
};

type Member = {
  id: string;
  name: string;
  role: string;
};

export default function Governance(): JSX.Element {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [members,] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newProposal, setNewProposal] = useState<Proposal>({
    id: "",
    title: "",
    description: "",
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProposal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addProposal = () => {
    if (newProposal.title && newProposal.description) {
      const newProposalObj: Proposal = {
        id: Date.now().toString(),
        title: newProposal.title,
        description: newProposal.description,
      };
      setProposals([...proposals, newProposalObj]);
      setNewProposal({ id: "", title: "", description: "" });
      closeModal();
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-black">
      <Header />
      
      <main className="flex-grow flex flex-col items-center gap-6 p-6">
        <p className="text-xl md:text-2xl text-white text-center max-w-4xl px-4">
          DAO dedicated to the well-functioning and growth of the XION Ecosystem.
        </p>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="border-r-2 p-6 shadow-lg col-span-2">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl font-bold mb-4">Proposals</h2>
              <button
                onClick={openModal}
                className="bg-blue-600 px-4 py-2 mb-4 text-white rounded-md transition"
              >
                + Add Proposal
              </button>
            </div>
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="bg-blue-800 p-4 rounded-lg shadow-md">
                  <h3 className="font-semibold text-lg">{proposal.title}</h3>
                  <p className="text-sm text-gray-300">{proposal.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Members</h2>
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="bg-blue-800 p-4 rounded-lg shadow-md">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-gray-300">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="border bg-black p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h2 className="text-xl font-bold text-white mb-4">Add New Proposal</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addProposal();
                }}
              >
                <div className="mb-4">
                  <label className="text-white block mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    value={newProposal.title}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-transparent border text-white rounded-md"
                    placeholder="Enter proposal title"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-white block mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newProposal.description}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-transparent border text-white rounded-md"
                    placeholder="Enter proposal description"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-blue-800 text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Submit Proposal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
