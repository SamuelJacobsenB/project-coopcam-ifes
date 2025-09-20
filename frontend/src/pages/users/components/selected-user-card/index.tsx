import { useEffect, useState } from "react";

import { Card, I, Input } from "../../../../components";
import type { User } from "../../../../types";

import styles from "./styles.module.css";

interface SelectedUserCardProps {
  selectedUser: User;
}

export function SelectedUserCard({ selectedUser }: SelectedUserCardProps) {
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [adress, setAdress] = useState("");
  const [cep, setCep] = useState("");
  const [birth, setBirth] = useState("");

  useEffect(() => {
    setName(selectedUser.name);
    setEmail(selectedUser.email);
    setCpf(selectedUser.cpf);
    setPhone(selectedUser.phone);
    setAdress(selectedUser.adress);
    setCep(selectedUser.cep);
    setBirth(selectedUser.birth);
  }, [selectedUser]);

  function handleDelete() {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja deletar este usuário?"
    );
    if (confirmDelete) {
      // Aqui você pode chamar sua função de exclusão, por exemplo:
      console.log("Usuário deletado:", selectedUser.id);
      // deleteUser(selectedUser.id);
    }
  }

  return (
    <Card className={styles.selectedUserBox}>
      <div className={styles.buttons}>
        {editMode && (
          <>
            <button className="btn-sm btn-success" onClick={() => {}}>
              Concluir
            </button>
          </>
        )}
        <button
          className="btn-sm btn-info"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Cancelar" : "Editar"}
        </button>
        <button className="btn-sm btn-danger" onClick={handleDelete}>
          Deletar
        </button>
      </div>
      <div className={styles.userPicture}>
        <I.user size={128} />
      </div>
      <div className={styles.userInfo}>
        {editMode ? (
          <Input
            label="Nome"
            name="name"
            type="text"
            placeholder="Digite o nome"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <h1>{selectedUser.name}</h1>
        )}
        <hr />
        <div className={styles.userDetails}>
          <section>
            {editMode ? (
              <>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Digite o email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="CPF"
                  name="cpf"
                  type="text"
                  placeholder="Digite o CPF"
                  required
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
                <Input
                  label="Telefone"
                  name="phone"
                  type="text"
                  placeholder="Digite o telefone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </>
            ) : (
              <>
                <p>Email: {selectedUser.email}</p>
                <p>CPF: {selectedUser.cpf}</p>
                <p>Telefone: {selectedUser.phone}</p>
              </>
            )}
          </section>
          <section>
            {editMode ? (
              <>
                <Input
                  label="Endereço"
                  name="adress"
                  type="text"
                  placeholder="Digite o endereço"
                  required
                  value={adress}
                  onChange={(e) => setAdress(e.target.value)}
                />
                <Input
                  label="CEP"
                  name="cep"
                  type="text"
                  placeholder="Digite o CEP"
                  required
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                />
                <Input
                  label="Data de nascimento"
                  name="birth"
                  type="date"
                  placeholder="Digite a data de nascimento"
                  required
                  value={birth.split("/").reverse().join("-")}
                  onChange={(e) => setBirth(e.target.value)}
                />
              </>
            ) : (
              <>
                <p>Endereço: {selectedUser.adress}</p>
                <p>CEP: {selectedUser.cep}</p>
                <p>
                  Data de nascimento: {selectedUser.birth as unknown as string}
                </p>
              </>
            )}
          </section>
        </div>
        {editMode && (
          <Input
            label="Nova Senha"
            name="password"
            type="password"
            placeholder="Digite nova senha"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}
      </div>
    </Card>
  );
}
