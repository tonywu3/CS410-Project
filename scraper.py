from lxml import html
import requests
import json

f = open('assets/pokemon.json', 'w')

page = requests.get('https://pokemondb.net/pokedex/national')
tree = html.fromstring(page.content)

pokemon = tree.xpath('//a[@class="ent-name"]/text()')
smallElement = tree.xpath('//small[@class="aside"]')

pokemonList = []
typeList = []

for pokemon in pokemon:
	# print(pokemon.encode('utf-8'))
	# pokemonList.append(pokemon.encode('utf-8'))
	pokemonList.append(pokemon)

#Types are in a list of either size 1 or 2
for typings in smallElement:
	# print(typings.xpath('a/text()'))
	types = typings.xpath('a/text()')
	typeList.append(types)

f.write('{\n"pokemon":[\n')

for i in range(0, 802):
	pokemon = {
	    'name': pokemonList[i],
	    'type': typeList[i],
	}
	f.write(json.dumps(pokemon, sort_keys=True, indent=4))
	if(i != 801):
		f.write(',')
	f.write('\n')
# for i in range(0, 802):
# 	print(pokemonList[i])
# 	print(typeList[i])
f.write(']\n}')
# print(json.dumps(pokemon, sort_keys=True, indent=4))

f.close()