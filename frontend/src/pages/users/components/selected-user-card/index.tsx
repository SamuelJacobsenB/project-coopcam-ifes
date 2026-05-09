import { useEffect, useState } from "react";

import { Card, Checkbox, Error, I, Input } from "../../../../components";
import type { User } from "../../../../types";
import {
  formatCEP,
  formatCPF,
  formatDateForInput,
  formatPhone,
  normalizeDate,
} from "../../../../utils";

import { EditableField, UserActions } from "./components";

import styles from "./styles.module.css";

interface SelectedUserCardProps {
  selectedUser: User;
  setSelectedUser: (user: User | null) => void;
}

export function SelectedUserCard({
  selectedUser,
  setSelectedUser,
}: SelectedUserCardProps) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cep, setCep] = useState("");
  const [birth, setBirth] = useState("");
  const [hasFinancialAid, setHasFinancialAid] = useState(false);

  const [error, setError] = useState("");

  const syncState = (user: User) => {
    setName(user.name);
    setEmail(user.email);
    setCpf(user.cpf);
    setPhone(user.phone);
    setAddress(user.address);
    setCep(user.cep);
    setBirth(normalizeDate(user.birth));
    setHasFinancialAid(user.has_financial_aid);

    setPassword("");
    setEditMode(false);
    setError("");
  };

  useEffect(() => {
    if (selectedUser) syncState(selectedUser);
  }, [selectedUser]);

  const currentUserData = {
    name,
    email,
    cpf,
    phone,
    address,
    cep,
    has_financial_aid: hasFinancialAid,
    password: password || "",
    birth: new Date(birth),
  };

  return (
    <Card className={styles.selectedUserBox}>
      <UserActions
        editMode={editMode}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        currentUserData={currentUserData}
        setError={setError}
        onToggleEdit={() =>
          editMode ? syncState(selectedUser) : setEditMode(true)
        }
      />

      <header className={styles.userHeader}>
        <div className={styles.userPicture}>
          <I.user size={80} color="#64748b" />
        </div>
        <div className={styles.userTitleInfo}>
          {editMode ? (
            <Input
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          ) : (
            <h1>{name}</h1>
          )}
        </div>
      </header>

      <hr />

      <div className={styles.userInfo}>
        <div className={styles.userDetails}>
          <section>
            <EditableField
              label="Email"
              type="email"
              name="email"
              value={email}
              editMode={editMode}
              onChange={setEmail}
            />
            <EditableField
              label="CPF"
              name="cpf"
              type="text"
              value={formatCPF(cpf)}
              editMode={editMode}
              onChange={(v) => setCpf(v.replace(/\D/g, ""))}
            />
            <EditableField
              label="Telefone"
              name="phone"
              type="text"
              value={formatPhone(phone)}
              editMode={editMode}
              onChange={(v) => setPhone(v.replace(/\D/g, ""))}
            />
          </section>

          <section>
            <EditableField
              label="Endereço"
              name="address"
              type="text"
              value={address}
              editMode={editMode}
              onChange={setAddress}
            />
            <EditableField
              label="CEP"
              name="cep"
              type="text"
              value={formatCEP(cep)}
              editMode={editMode}
              onChange={(v) => setCep(v.replace(/\D/g, ""))}
            />
            <EditableField
              label="Nascimento"
              name="birth"
              type="date"
              value={formatDateForInput(birth)}
              editMode={editMode}
              onChange={setBirth}
            />
            <Checkbox
              label="Recebe auxílio"
              checked={hasFinancialAid}
              disabled={!editMode}
              onChange={(e) => setHasFinancialAid(e.target.checked)}
            />
          </section>
        </div>

        {editMode && (
          <div style={{ marginTop: "1rem" }}>
            <Input
              label="Redefinir Senha"
              type="password"
              placeholder="Em branco para manter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        <Error error={error} onClose={() => setError("")} />
      </div>
    </Card>
  );
}
