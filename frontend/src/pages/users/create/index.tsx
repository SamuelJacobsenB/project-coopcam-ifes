import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useMessage } from "../../../contexts";
import { useCreateUser } from "../../../hooks";
import { Error, FormPage, I, Input, Private } from "../../../components";
import { validateUserRequestDTO } from "../../../utils";
import type { UserRequestDTO } from "../../../types";

import styles from "./styles.module.css";

export function CreateUserPage() {
  const navigate = useNavigate();

  const { createUser } = useCreateUser();
  const { showMessage } = useMessage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [adress, setAdress] = useState("");
  const [cep, setCep] = useState("");
  const [birth, setBirth] = useState("");
  const [error, setError] = useState("");

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const user: UserRequestDTO = {
      name,
      email,
      password,
      cpf,
      phone,
      adress,
      cep,
      birth,
    };

    const error = validateUserRequestDTO(user);
    if (error) {
      setError(error);
      return;
    }

    try {
      await createUser(user);

      showMessage("Usuário criado com sucesso!", "success");
      navigate("/usuarios");
    } catch {
      showMessage("Erro ao criar usuário", "error");
    }
  }

  return (
    <Private>
      <FormPage className={styles.formSection}>
        <Link className={styles.back} to="/usuarios">
          <I.arrow_back />
        </Link>
        <section className={styles.header}>
          <h1 className={styles.title}>Criar Usuário</h1>
          <hr />
        </section>
        <form onSubmit={handleCreateUser} className={styles.form}>
          <Error error={error} onClose={() => setError("")} />
          <Input
            label="Nome"
            name="name"
            type="text"
            placeholder="Digite o nome"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            label="Senha"
            name="password"
            type="password"
            placeholder="Digite a senha"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            label="Data de Nascimento"
            name="birth"
            type="date"
            placeholder="Digite a data de nascimento"
            required
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
          />
          <button className="btn btn-secondary">Enviar</button>
        </form>
      </FormPage>
    </Private>
  );
}
