import { Editor } from "@tinymce/tinymce-react";

export default function TinyMCE() {
  const handleImageUpload = (blobInfo, progress, failure) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost/php/server.php", true);

      const formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());
      //console.log(blobInfo.filename())

      xhr.upload.onprogress = (e) => {
        progress((e.loaded / e.total) * 100);
        if (progress && typeof progress === "function") {
          const percent = 0;
          progress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 403) {
          reject({ message: "HTTP Error: " + xhr.status, remove: true });
          return;
        }

        if (xhr.status < 200 || xhr.status >= 300) {
          reject("HTTP Error: " + xhr.status);
          return;
        }

        const json = JSON.parse(xhr.responseText);

        if (!json || typeof json.location != "string") {
          reject("Invalid JSON: " + xhr.responseText);
          return;
        }

        resolve(json.location);
      };

      xhr.onerror = () => {
        reject({ message: "Image upload failed", remove: true });
        if (failure && typeof failure === "function") {
          failure("Image upload failed");
        }
      };

      xhr.send(formData);
    });
  };

  return (
    <>
      <Editor
        apiKey="pz9f1zsrw3kqfmqecr5si4gbtfljkwc6nhqicfr9dstcvmdn"
        // onInit={(evt, editor) => (editorRef.current = editor)}
        // initialValue={
        //   emailData.template_content &&
        //   `${emailData.template_content}`
        // }
        initialValue={""}
        init={{
          height: "400",
          plugins:
            "ai tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          tinycomments_mode: "embedded",
          images_upload_url: "http://localhost/php/server.php",
          automatic_uploads: true,
          images_reuse_filename: true,
          images_upload_handler: handleImageUpload,
          tinycomments_author: "Tutor Pad",
          mergetags_list: [
            { value: "UserName", title: "User Name" },
            { value: "FirstName", title: "First Name" },
            { value: "LastName", title: "Last Name" },
            { value: "Email", title: "Email" },
          ],
          ai_request: (request, respondWith) =>
            respondWith.string(() =>
              Promise.reject("See docs to implement AI Assistant")
            ),
        }}
      />
    </>
  );
}
