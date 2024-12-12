import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import useLocalStorageState from "use-local-storage-state";
import { useRouter } from "next/router";
import ProfileForm from "./ProfileForm";

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
