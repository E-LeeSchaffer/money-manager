import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import useLocalStorageState from "use-local-storage-state";
import { useRouter } from "next/router";

const avatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
];

export default function UserProfile({
  isEditing,
  setIsEditing,
  successMessage,
  setSuccessMessage,
}) {
  const [profile, setProfile] = useLocalStorageState("userProfile", {
    defaultValue: {
      firstName: "",
      lastName: "",
      avatar: avatars[0],
    },
  });

  const router = useRouter();

  function handleSave(updatedProfile) {
    const isNewProfile = !profile.firstName && !profile.lastName;

    setProfile(updatedProfile);
    setIsEditing(false);

    setSuccessMessage(
      isNewProfile
        ? "Profile successfully created."
        : "Profile successfully updated."
    );

    router.push("/profile");
  }

  function handleCancel() {
    setIsEditing(false);
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleBack() {
    if (isEditing) {
      setIsEditing(false);
    } else {
      router.push("/");
    }
  }

  const title = isEditing
    ? profile.firstName || profile.lastName
      ? "Edit Profile"
      : "Create Profile"
    : "Profile";

  return (
    <>
      <StyledBackLink as="button" onClick={handleBack}>
        <StyledImage
          aria-hidden="true"
          src="/images/arrow-return-left.svg"
          alt="edit button"
          width={15}
          height={15}
        />
        Back
      </StyledBackLink>
      <StyledProfileContainer>
        <StyledTitle>{title}</StyledTitle>
        {!isEditing && (
          <EditButton onClick={handleEdit}>
            <StyledImage
              aria-hidden="true"
              src="/images/pencil.svg"
              alt="edit button"
              width={15}
              height={15}
            />
          </EditButton>
        )}
      </StyledProfileContainer>
      <Container>
        {!isEditing ? (
          <ProfileView>
            <Avatar src={profile.avatar} alt="Profile Avatar" />
            <Name>
              {`${profile.firstName} ${profile.lastName}` || "Your Name"}
            </Name>
          </ProfileView>
        ) : (
          <ProfileForm
            initialProfile={profile}
            avatars={avatars}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </Container>
      {successMessage && (
        <StyledSuccessMessage>{successMessage}</StyledSuccessMessage>
      )}
    </>
  );
}

const StyledProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
`;

const Container = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
`;

const ProfileView = styled.div`
  text-align: center;
  border: solid 1px;
  border-radius: 30px;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 10px auto;
`;

const Name = styled.h2`
  margin: 10px 0;
  font-size: 1rem;
`;

const EditButton = styled.button`
  border: none;
  background-color: transparent;
  padding: 0;
`;

const StyledBackLink = styled(Link)`
  display: flex;
  align-items: center;
  background-color: var(--accent-color);
  text-decoration: none;
  width: fit-content;
  color: black;
  position: relative;
  top: 10px;
  left: 10px;
  border: var(--accent-color);
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  gap: 0.5rem;
`;

const StyledImage = styled(Image)`
  display: flex;
`;

const StyledTitle = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
`;

const StyledSuccessMessage = styled.p`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text-color-dark);
  font-size: 0.8rem;
  padding: 6px 4px;
  width: 220px;
  font-weight: 800;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  background-color: var(--friendly-green-color);
`;

function ProfileForm({ initialProfile, avatars, onSave, onCancel }) {
  const [formValues, setFormValues] = useState(initialProfile);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormValues((previous) => ({ ...previous, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave(formValues);
  }

  return (
    <form onSubmit={handleSubmit}>
      <AvatarSelection>
        <p>Select Avatar:</p>
        {avatars?.map((avatar) => (
          <AvatarOption key={avatar}>
            <StyledRadioinput
              type="radio"
              id={`avatar-${avatar}`}
              name="avatar"
              value={avatar}
              checked={formValues.avatar === avatar}
              onChange={handleInputChange}
            />
            <AvatarLabel
              htmlFor={`avatar-${avatar}`}
              $isSelected={formValues.avatar === avatar}
            >
              <AvatarSelectionImage src={avatar} alt="Avatar Option" />
            </AvatarLabel>
          </AvatarOption>
        ))}
      </AvatarSelection>

      <InputField>
        <StyledLabel htmlFor="firstName">First Name</StyledLabel>
        <StyledInput
          id="firstName"
          name="firstName"
          type="text"
          maxLength={20}
          value={formValues.firstName}
          onChange={handleInputChange}
        />
        <Counter>{formValues.firstName?.length}/20</Counter>
      </InputField>
      <InputField>
        <StyledLabel htmlFor="lastName">Last Name</StyledLabel>
        <StyledInput
          id="lastName"
          name="lastName"
          type="text"
          maxLength={20}
          value={formValues.lastName}
          onChange={handleInputChange}
        />
        <Counter>{formValues.lastName?.length}/20</Counter>
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

  cursor: pointer;
`;

const AvatarLabel = styled.label`
  display: block;
  cursor: pointer;
  border: 2px solid ${(props) => (props.$isSelected ? "black" : "transparent")};
  border-radius: 50%;
  padding: 4px;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: black;
  }
`;

const StyledRadioinput = styled.input`
  display: none;
`;

const AvatarSelectionImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const InputField = styled.div`
  display: flex;
  flex-direction: column;
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

const StyledInput = styled.input`
  padding: 6px;
  border: 1px solid gray;
  border-radius: 4px;
`;

const StyledLabel = styled.label`
  font-size: 14px;
  margin-bottom: 4px;
`;
