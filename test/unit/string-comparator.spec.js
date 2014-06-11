describe('module: StringComparator', function () {
	describe('method: compare', function () {
		it('compares two strings and gives back strings added, removed and changed', function () {
			var str1 = 'line 1\n' +
				'line 2\n' +
				'line 3\n' +
				'line 4\n' +
				'line 5';
			var str2 = 'line 1\n' +
				'line 2\n' +
				'line 30\n' +
				'line 4\n' +
				'line 5\n';

			var comparator = VWO.StringComparator.create({
				stringA: str1,
				stringB: str2,
				splitOn: '\n'
			});

			comparator.compare();

			expect(comparator.stringsUnchanged).toEqual([
				new VWO.StringComparisonResult('line 1', 0, 0),
				new VWO.StringComparisonResult('line 2', 1, 1),
				//new VWO.StringComparisonResult('line 3', 2, 2),
				new VWO.StringComparisonResult('line 4', 3, 3),
				new VWO.StringComparisonResult('line 5', 4, 4)
			]);
			expect(comparator.stringsDeletedFromA).toEqual([new VWO.StringComparisonResult('line 3', 2, -1)]);
			expect(comparator.stringsAddedInB).toEqual([new VWO.StringComparisonResult('line 30', -1, 2)]);
		});
	});
});
