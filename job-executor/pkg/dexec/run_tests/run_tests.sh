java -jar $1 -cp target --scan-class-path --disable-ansi-colors --disable-banner --details=tree > output.txt

grep "tests successful\|tests failed" output.txt | \
awk -F '[[:space:]][[:space:]]+' '{print $2}' | \
awk -F '[[:space:]][[:space:]]+' '{print $1}'

grep "✘" output.txt | awk -F '✘ ' '{print $2}'
