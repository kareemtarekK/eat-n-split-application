import { useState } from "react";

const initialFriends = [
  {
    id: 55555,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=55555",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showFormAddFriend, setShowFormAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function toggleShowFormAddFriend() {
    setShowFormAddFriend((show) => !show);
    setSelectedFriend(null);
  }

  function addFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }

  function handleSelection(friend) {
    // setSelectedFriend((selectedFriend) => (selectedFriend ? null : friend));
    setSelectedFriend((selectedFriend) =>
      selectedFriend?.id === friend.id ? null : friend
    );
    setShowFormAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="collection">
        <FriendsList
          friends={friends}
          onSelect={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showFormAddFriend && (
          <FormAddFriend
            onAddFriend={addFriend}
            onShowFormAddFriend={setShowFormAddFriend}
          />
        )}
        <Button onClick={toggleShowFormAddFriend}>
          {showFormAddFriend ? "close" : "add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, selectedFriend, onSelect }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelect={onSelect}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={`${isSelected ? "selected" : ""}`}>
      <img src={friend.image} alt={friend.name} />
      <div>
        <p className="name">{friend.name}</p>
        {friend.balance > 0 && (
          <p className="text green">
            {friend.name} owe you {friend.balance}€
          </p>
        )}
        {friend.balance < 0 && (
          <p className="text red">
            you owe {friend.name} {Math.abs(friend.balance)}€
          </p>
        )}
        {friend.balance === 0 && (
          <p className="text">you and {friend.name} are even</p>
        )}
      </div>
      <Button onClick={() => onSelect(friend)}>
        {isSelected ? "close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick} className="close">
      {children}
    </button>
  );
}

function FormAddFriend({ onAddFriend, onShowFormAddFriend }) {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("https://i.pravatar.cc/48");
  const id = crypto.randomUUID();
  const newFriend = { id, balance: 0, name, image: `${photo}?u=${id}` };
  function handleAddNewFriend(e) {
    e.preventDefault();
    if (!name || !photo) return;
    onAddFriend(newFriend);
    setName("");
    setPhoto("");
    onShowFormAddFriend(false);
  }
  return (
    <form className="form-add-friend" onSubmit={handleAddNewFriend}>
      <label>👦 new friend</label>
      <input
        type="text"
        placeholder="friend name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🤳 image url</label>
      <input
        type="text"
        placeholder="photo url"
        value={photo}
        onChange={(e) => setPhoto(e.target.value)}
      />
      <Button>add friend</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="from-split-bill" onSubmit={handleSubmit}>
      <h5>split a bill with {selectedFriend.name}</h5>
      <label className="l1">💰 bill value</label>
      <input
        className="i1"
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label className="l2">👦your expense</label>
      <input
        className="i2"
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />
      <label className="l3">👦 {selectedFriend.name}`s expense</label>
      <input className="i3" type="text" disabled value={paidByFriend} />
      <select
        className="s1"
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">you</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <button className="b1">split bill</button>
    </form>
  );
}
