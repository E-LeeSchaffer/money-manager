import { useState } from "react";
import styled from "styled-components";

export default function ProfileForm({
  initialProfile,
  avatars,
  onSave,
  onCancel,
}) {
  const [tempProfile, setTempProfile] = useState({ ...initialProfile });

  function handleAvatarChange(avatar) {
    setTempProfile((prev) => ({ ...prev, avatar }));
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setTempProfile((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(tempProfile);
  }

  return (
    <form onSubmit={handleSubmit}>
      <AvatarSelection>
        <p>Select Avatar:</p>
        {avatars.map((avatar) => (
          <AvatarOption
            key={avatar}
            isSelected={tempProfile.avatar === avatar}
            onClick={() => handleAvatarChange(avatar)}
          >
            <AvatarSelectionImage src={avatar} alt="Avatar Option" />
          </AvatarOption>
        ))}
      </AvatarSelection>
      <InputField>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          maxLength={20}
          value={tempProfile.firstName}
          onChange={handleInputChange}
        />
        <Counter>{tempProfile.firstName.length}/20</Counter>
      </InputField>
      <InputField>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          maxLength={20}
          value={tempProfile.lastName}
          onChange={handleInputChange}
        />
        <Counter>{tempProfile.lastName.length}/20</Counter>
      </InputField>
      <ButtonRow>
        <CancelButton type="button" onClick={onCancel}>
          Cancel
        </CancelButton>
        <SaveButton type="submit">Save</SaveButton>
      </ButtonRow>
    </form>
  );
}

const AvatarSelection = styled.div`
  display: flex;
  justify-content: space-around;
`;

const AvatarOption = styled.label`
  padding: 4px;
  border: ${(props) =>
    props.isSelected ? "2px solid black" : "1px solid gray"};
  border-radius: 50%;
  cursor: pointer;
`;

const AvatarSelectionImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
  label {
    font-size: 14px;
    margin-bottom: 4px;
  }
  input {
    padding: 6px;
    border: 1px solid gray;
    border-radius: 4px;
  }
`;

const Counter = styled.span`
  font-size: 12px;
  color: gray;
  text-align: right;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background: black;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: none;
  color: black;
  border: solid 1px;
  border-radius: 8px;
  cursor: pointer;
`;
