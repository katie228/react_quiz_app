import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
import { read, utils } from "xlsx";

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
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

        // Предположим, что данные студентов находятся в первом листе файла
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const studentsData = utils.sheet_to_json(worksheet, { header: "A" });

        let endIndex = studentsData.length - 1; // Индекс последней строки, которую нужно исключить

        // Пропустить строки, которые не содержат данных студентов
        let startIndex = 5; // Индекс строки, с которой начинаются данные студентов
        while (
          startIndex <= endIndex &&
          studentsData[startIndex].length === 0
        ) {
          startIndex++;
        }

        console.log(
          "Данные студентов:",
          studentsData.slice(startIndex, endIndex)
        ); // Выводим данные студентов в консоль

        const auth = getAuth(initializeApp(firebaseConfig));

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
        }

        console.log("Регистрация студентов завершена");

        // Создание и скачивание файла Excel
        const workbookForDownload = utils.book_new();
        const worksheetForDownload = utils.json_to_sheet(studentsData);
        utils.book_append_sheet(
          workbookForDownload,
          worksheetForDownload,
          "Students"
        );
        const excelData = utils.write(workbookForDownload, {
          type: "buffer",
          bookType: "xlsx",
        });
        const dataBlob = new Blob([excelData], {
          type: "application/octet-stream",
        });
        const downloadUrl = URL.createObjectURL(dataBlob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "students.xlsx";
        a.click();
        URL.revokeObjectURL(downloadUrl);
      };

      fileReader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      console.error("Ошибка при регистрации студентов:", error);
    }
  };

  const generateRandomPassword = () => {
    const length = 8; // Длина сгенерированного пароля
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Набор символов, используемых в пароле
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
