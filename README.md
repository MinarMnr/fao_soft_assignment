# fao_soft_assignment

Prerequisite technology for running this application is : Node js (prefebally version >= 14)

# # Instruction

1. No need to run `npm i`, as `node_modules` and other all necessary files are there (NO `.gitignore` used). Just hit `git clone https://github.com/MinarMnr/fao_soft_assignment.git` from your system . Run few commands (which will be mentioned below) and appliction will run smoothly.

2. After `git clone https://github.com/MinarMnr/fao_soft_assignment.git` , please open cmd from that project folder .

3. For task `A` command is : `node main data_cases_1 general` - here data_cases_1 is input file and general is output json. (Note: input file and all other files sould be at same location ).
   seconnd command: `node main data_cases_2 general` . If you run that command, output file will overwrite. But if you not want that , then change `general` to `something`, then new output file will create.

4. For corrupted file , For task `D` command is : `node main data_cases_corrupted corrupted`, result will generate but not accurate. In main.js, you will find my comment what I did.

5. For advance result, For task `E` command is : `node main data_cases_1 advance`. (Note: <b>advance</b> is required for output more advanced indicators). Output File name should "advance" for accurate result .

Please feel free to contact with me if you have any query .
