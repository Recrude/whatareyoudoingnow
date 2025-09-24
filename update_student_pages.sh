#!/bin/bash

# 학생 목록
students=("02-sion" "03-seungju" "04-hyeonsu" "05-seungwan" "06-hyeonseong" "07-yerim" "08-jiheon" "09-doyoon" "10-jaewon" "11-mariyam" "12-simga" "13-juchan" "14-yeonwoo" "15-jihoo" "16-shini")

# 각 학생 페이지 업데이트
for student in "${students[@]}"; do
    echo "Updating $student/index.html..."
    
    # 01-jaeyeon을 템플릿으로 사용하여 각 학생 페이지 생성
    cp 01-jaeyeon/index.html $student/index.html
    
    # 각 학생에 맞게 수정
    sed -i '' "s/재연 - 어쩌구졸프는어쩌구.../${student#*-} - 어쩌구졸프는어쩌구.../g" $student/index.html
    sed -i '' "s/YOUR_JAEYEON_DOCUMENT_ID/YOUR_${student^^}_DOCUMENT_ID/g" $student/index.html
    sed -i '' "s/01-jaeyeon/$student/g" $student/index.html
    
    # active 버튼 변경
    sed -i '' "s/student-button active\" onclick=\"navigateToStudent('01-jaeyeon')\">재연/student-button\" onclick=\"navigateToStudent('01-jaeyeon')\">재연/g" $student/index.html
    sed -i '' "s/student-button\" onclick=\"navigateToStudent('$student')\">${student#*-}/student-button active\" onclick=\"navigateToStudent('$student')\">${student#*-}/g" $student/index.html
done

echo "All student pages updated!"
