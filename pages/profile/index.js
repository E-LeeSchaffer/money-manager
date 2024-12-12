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
      avatar: "/avatars/avatar1.png",
    },
  });

  const [tempProfile, setTempProfile] = useState({ ...profile });
  const router = useRouter();

  function handleSave() {
    const isNewProfile = !profile.firstName && !profile.lastName;

    setProfile(tempProfile);
    setIsEditing(false);

    if (isNewProfile) {
      setSuccessMessage("Profile successfully created.");
    } else {
      setSuccessMessage("Profile successfully updated.");
    }

    router.push("/profile");
  }

  function handleCancel() {
    setTempProfile({ ...profile });
    setIsEditing(false);
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleAvatarChange(avatar) {
    const updatedProfile = { ...tempProfile, avatar };
    setTempProfile(updatedProfile);
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
      {" "}
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
        <EditButton onClick={handleEdit}>
          <StyledImage
            aria-hidden="true"
            src="/images/pencil.svg"
            alt="edit button"
            width={15}
            height={15}
          />
        </EditButton>
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
          <ProfileEdit>
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
              <label>First Name</label>
              <input
                type="text"
                maxLength={20}
                value={tempProfile.firstName}
                onChange={(event) =>
                  setTempProfile((previous) => ({
                    ...previous,
                    firstName: event.target.value,
                  }))
                }
              />
              <Counter>{tempProfile.firstName.length}/20</Counter>
            </InputField>
            <InputField>
              <label>Last Name</label>
              <input
                type="text"
                maxLength={20}
                value={tempProfile.lastName}
                onChange={(event) =>
                  setTempProfile((previous) => ({
                    ...previous,
                    lastName: event.target.value,
                  }))
                }
              />
              <Counter>{tempProfile.lastName.length}/20</Counter>
            </InputField>
            <ButtonRow>
              <CancelButton onClick={handleCancel}>Cancel</CancelButton>
              <SaveButton onClick={handleSave}>Save</SaveButton>
            </ButtonRow>
          </ProfileEdit>
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

const ProfileEdit = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 10px auto;
`;

const AvatarSelectionImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 10px auto;
`;

const AvatarSelection = styled.div`
  display: flex;
  justify-content: space-around;
`;

const AvatarOption = styled.div`
  padding: 4px;
  border: ${(props) =>
    props.isSelected ? "2px solid black" : "1px solid gray"};
  border-radius: 50%;
  cursor: pointer;
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
