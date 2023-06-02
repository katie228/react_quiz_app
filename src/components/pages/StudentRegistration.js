import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { read, utils, writeFile } from "xlsx";

const firebaseConfig = {
  apiKey: "AIzaSyCSyR-75dzFPSlknW1Pj8VSkxcnWqyJ8pI",
  authDomain: "quiz-1c883.firebaseapp.com",
  projectId: "quiz-1c883",
  storageBucket: "quiz-1c883.appspot.com",
  messagingSenderId: "46773582129",
  appId: "1:46773582129:web:ad3af0bde57309c2f85810",
  databaseURL: "https://quiz-1c883-default-rtdb.firebaseio.com",
};

const StudentRegistration = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalFileName, setOriginalFileName] = useState("");
  const history = useHistory();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setOriginalFileName(file.name);
  };

  const handleRegistration = async () => {
    try {
      if (!selectedFile) {
        return;
      }

      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: "array" });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const studentsData = utils.sheet_to_json(worksheet, { header: "A" });

        let endIndex = studentsData.length - 1;

        let startIndex = 4;
        while (
          startIndex <= endIndex &&
          studentsData[startIndex].length === 0
        ) {
          startIndex++;
        }

        console.log(
          "Данные студентов:",
          studentsData.slice(startIndex, endIndex)
        );

        const auth = getAuth(initializeApp(firebaseConfig));
        const db = getDatabase();

        const studentsForExcel = [];

        for (let i = startIndex; i < endIndex; i++) {
          const student = studentsData[i];
          const displayName = student["C"];
          const studentId = student["D"];
          const email = `${studentId}@mail.ru`;
          const password = generateRandomPassword();

          console.log("Студент:", displayName);
          console.log("Номер зачетной книжки:", studentId);
          console.log("Email:", email);
          console.log("Пароль:", password);

          await createUserWithEmailAndPassword(auth, email, password);
          const user = auth.currentUser;
          await updateProfile(user, { displayName });

          console.log(`Студент ${displayName} зарегистрирован`);

          studentsForExcel.push({ name: displayName, email, password });
          const userRole = {
            role: "student",
            group: originalFileName.replace(".xlsx", ""),
          };
          await set(ref(db, "roles/" + user.uid), userRole);
        }

        console.log("Регистрация студентов завершена");

        const newWorkbook = utils.book_new();
        const newWorksheet = utils.json_to_sheet(studentsForExcel, {
          header: ["name", "email", "password"],
        });
        utils.book_append_sheet(newWorkbook, newWorksheet, "New Students");

        const newFileName = originalFileName.replace(
          ".xlsx",
          "_passwords.xlsx"
        );
        writeFile(newWorkbook, newFileName);

        // Try to sign out the user and catch any errors
        try {
          await signOut(auth);
          history.push("/login");
        } catch (error) {
          console.error("Ошибка при выходе из системы:", error);
        }
      };

      fileReader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error("Ошибка при регистрации студентов:", error);
    }
  };

  const generateRandomPassword = () => {
    const length = 8;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  return (
    <div>
      <input type="file" accept=".xlsx" onChange={handleFileUpload} />
      <button onClick={handleRegistration}>Зарегистрировать студентов</button>
    </div>
  );
};

export default StudentRegistration;
