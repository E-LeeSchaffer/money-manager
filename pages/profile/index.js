import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import useLocalStorageState from "use-local-storage-state";
import { useRouter } from "next/router";
import BackButton from "@/components/BackButton";

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
      <BackButton handleBack={handleBack} variant="profilepage" />

      <StyledPageLinks>
        <>
          <Link href={"/report"} aria-label="Report">
            <Image
              src={"/images/report.svg"}
              alt="report button"
              width={20}
              height={20}
            />
          </Link>
          <Link href={"/settings"} aria-label="Settings">
            <Image
              aria-hidden="true"
              src={"/images/settings.svg"}
              alt="filter button"
              width={20}
              height={20}
            />
          </Link>
        </>
      </StyledPageLinks>
      <StyledPageMain>
        <h2>{title}</h2>

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

        <Container>
          {!isEditing ? (
            <ProfileView>
              <Avatar src={profile.avatar} alt="Profile Avatar" />
              <h3>
                {`${profile.firstName} ${profile.lastName}` || "Your Name"}
              </h3>
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
      </StyledPageMain>
    </>
  );
}

const StyledPageLinks = styled.div`
  display: flex;
  gap: var(--gap-lg);
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 2000;
`;

const StyledPageMain = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-md);
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-lg);
  border: var(--border-brand);
  background-color: var(--white-bg-color);
  border-radius: 30px;
  width: 300px;
  padding: 6px 16px;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 10px auto;
`;

const EditButton = styled.button`
  border: none;
  background-color: transparent;
  padding: 0;
  position: absolute;
  top: 127px;
  right: 115px;
`;

const StyledImage = styled(Image)`
  display: flex;
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
      <StyledFieldset>
        <AvatarSelection>
          <StyledSelectLabel>Select Avatar:</StyledSelectLabel>
          {avatars?.map((avatar) => (
            <div key={avatar}>
              <StyledRadioInput
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
            </div>
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
        </InputField>
        <Counter>{formValues.firstName?.length}/20</Counter>
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
        </InputField>
        <Counter>{formValues.lastName?.length}/20</Counter>
      </StyledFieldset>
      <ButtonRow>
        <CancelButton type="button" onClick={onCancel}>
          Cancel
        </CancelButton>
        <SaveButton type="submit">Save</SaveButton>
      </ButtonRow>
    </form>
  );
}

const StyledFieldset = styled.fieldset`
  border-radius: 16px;
  border-width: 1px;
  border: var(--border-brand);
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  gap: var(--gap-sm);
  margin-bottom: 20px;
`;

const StyledSelectLabel = styled.p`
  font-weight: bold;
  width: 100px;
`;

const AvatarSelection = styled.div`
  display: flex;
  gap: var(--gap-md);
  align-items: center;
  font-size: var(--font-size-lg);
  margin-bottom: 20px;
`;

const AvatarLabel = styled.label`
  display: block;
  border: ${(props) =>
    props.$isSelected ? "0.1px solid black" : "var(--border-brand)"};
  border-radius: 50%;
  transition: border-color 0.2s ease;
  box-shadow: var(--shadow-brand);

  &:hover {
    border-color: black;
  }
`;

const StyledRadioInput = styled.input`
  display: none;
`;

const AvatarSelectionImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const InputField = styled.div`
  display: flex;
  gap: var(--gap-sm);
`;

const Counter = styled.span`
  font-size: var(--font-size-xs);
  line-height: 1.4;
  color: var(--dark-grey-color);
  display: flex;
  justify-content: end;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--gap-xs);
`;

const SaveButton = styled.button`
  border-radius: 24px;
  background-color: var(--accent-color);
  padding: 4px 24px;
  border: none;
  box-shadow: var(--shadow-brand);
`;

const CancelButton = styled.button`
  border-radius: 24px;
  background-color: transparent;
  padding: 4px 24px;
`;

const StyledInput = styled.input`
  display: flex;
  flex: 1;
  padding: 2px 12px;
  border: var(--border-brand);
  border-radius: 24px;
  background-color: var(--white-bg-color);
  box-shadow: var(--shadow-brand);

  &:focus {
    outline: var(--border-accent);
  }
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: bold;
  width: 100px;
`;
