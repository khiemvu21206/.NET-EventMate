"use client";
import InviteComponent from "@/components/listInvite/InviteComponent.jsx";

export default function InviteListPage() {
  // Danh sách các nhóm giả lập
  const groups = [
    {
      id: 1,
      name: "Nhóm Rockers",
      leader: "John Doe",
      img: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      name: "EDM Lovers",
      leader: "Alice Smith",
      img: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      name: "K-Pop Fans",
      leader: "Kim Jihoon",
      img: "https://via.placeholder.com/150"
    }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Danh sách lời mời vào nhóm</h1>
      <div className="flex flex-col space-y-4">
        {groups.map((group) => (
          <InviteComponent key={group.id} />
        ))}
      </div>
    </div>
  );
}